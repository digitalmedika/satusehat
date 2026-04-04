import { afterEach, describe, expect, mock, test } from "bun:test";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

import {
  createClientCredentialsTokenProvider,
  createFileTokenStore,
  createMemoryTokenStore,
  isAccessTokenExpired,
} from "../src";

const tempPaths: string[] = [];

afterEach(async () => {
  await Promise.all(tempPaths.splice(0).map((path) => rm(path, { recursive: true, force: true })));
});

describe("token stores", () => {
  test("reuses cached token from memory store while still valid", async () => {
    let callCount = 0;
    const now = 1_000_000;
    const tokenStore = createMemoryTokenStore();
    const provider = createClientCredentialsTokenProvider({
      authBaseUrl: "https://example.com/oauth2/v1",
      clientId: "client-id",
      clientSecret: "client-secret",
      tokenStore,
      now: () => now,
      fetch: mock(async () => {
        callCount += 1;

        return new Response(
          JSON.stringify({
            access_token: "token-123",
            expires_in: 3600,
            token_type: "BearerToken",
            issued_at: String(now),
          }),
          {
            status: 200,
            headers: { "content-type": "application/json" },
          },
        );
      }),
    });

    const first = await provider();
    const second = await provider();

    expect(first).toBe("token-123");
    expect(second).toBe("token-123");
    expect(callCount).toBe(1);
  });

  test("refreshes token when cached token is expired", async () => {
    let now = 10_000;
    let callCount = 0;
    const tokenStore = createMemoryTokenStore({
      accessToken: "stale-token",
      tokenType: "BearerToken",
      issuedAt: 0,
      expiresIn: 60,
      expiresAt: 1_000,
    });
    const provider = createClientCredentialsTokenProvider({
      authBaseUrl: "https://example.com/oauth2/v1",
      clientId: "client-id",
      clientSecret: "client-secret",
      tokenStore,
      now: () => now,
      fetch: mock(async () => {
        callCount += 1;

        return new Response(
          JSON.stringify({
            access_token: "fresh-token",
            expires_in: 3600,
            token_type: "BearerToken",
            issued_at: String(now),
          }),
          {
            status: 200,
            headers: { "content-type": "application/json" },
          },
        );
      }),
    });

    const token = await provider();

    expect(token).toBe("fresh-token");
    expect(callCount).toBe(1);
  });

  test("persists token to file store", async () => {
    const tempDir = await mkdtemp(join(tmpdir(), "satusehat-token-store-"));
    tempPaths.push(tempDir);

    const filePath = join(tempDir, "token.json");
    const tokenStore = createFileTokenStore({ filePath });

    await tokenStore.setToken({
      accessToken: "persisted-token",
      tokenType: "BearerToken",
      issuedAt: 1_000,
      expiresIn: 3600,
      expiresAt: 3_601_000,
    });

    const raw = await readFile(filePath, "utf8");
    const saved = JSON.parse(raw) as { accessToken: string };
    const loaded = await tokenStore.getToken();

    expect(saved.accessToken).toBe("persisted-token");
    expect(loaded?.accessToken).toBe("persisted-token");
  });
});

describe("isAccessTokenExpired", () => {
  test("returns false for a token outside safety window", () => {
    expect(
      isAccessTokenExpired(
        { expiresAt: 70_000 },
        {
          now: 10_000,
          safetyWindowMs: 5_000,
        },
      ),
    ).toBe(false);
  });

  test("returns true for a token inside safety window", () => {
    expect(
      isAccessTokenExpired(
        { expiresAt: 12_000 },
        {
          now: 10_000,
          safetyWindowMs: 3_000,
        },
      ),
    ).toBe(true);
  });
});
