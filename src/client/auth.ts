import { z } from "zod";

import { SatuSehatApiError, SatuSehatConfigError, SatuSehatValidationError } from "../core/errors";
import { type FetchLike, type MaybePromise, type OAuthClientCredentials } from "../core/types";

const AccessTokenSchema = z.object({
  access_token: z.string().min(1),
  expires_in: z.coerce.number().positive(),
  token_type: z.string().min(1),
});

export interface ClientCredentialsTokenProviderOptions extends OAuthClientCredentials {
  authBaseUrl: string;
  fetch?: FetchLike;
  headers?: HeadersInit;
}

interface TokenCache {
  accessToken: string;
  expiresAt: number;
}

export function createClientCredentialsTokenProvider(
  options: ClientCredentialsTokenProviderOptions,
): () => Promise<string> {
  const httpClient = options.fetch ?? fetch;
  let cache: TokenCache | undefined;

  return async () => {
    const now = Date.now();

    if (cache && cache.expiresAt > now) {
      return cache.accessToken;
    }

    const authBaseUrl = options.authBaseUrl.replace(/\/$/, "");
    const body = new URLSearchParams({
      client_id: options.clientId,
      client_secret: options.clientSecret,
    });

    const response = await httpClient(`${authBaseUrl}/accesstoken?grant_type=client_credentials`, {
      method: "POST",
      headers: {
        "content-type": "application/x-www-form-urlencoded",
        ...options.headers,
      },
      body,
    });

    const raw = await safeParseJson(response);

    if (!response.ok) {
      throw new SatuSehatApiError(
        `SATUSEHAT auth request failed with status ${response.status}`,
        response.status,
        raw,
      );
    }

    const parsed = AccessTokenSchema.safeParse(raw);

    if (!parsed.success) {
      throw new SatuSehatValidationError(
        "SATUSEHAT auth response validation failed",
        parsed.error.issues,
      );
    }

    cache = {
      accessToken: parsed.data.access_token,
      expiresAt: now + Math.max(parsed.data.expires_in - 30, 1) * 1_000,
    };

    return cache.accessToken;
  };
}

export async function resolveAccessToken(
  accessToken?: string | (() => MaybePromise<string>),
): Promise<string | undefined> {
  if (!accessToken) {
    return undefined;
  }

  if (typeof accessToken === "string") {
    return accessToken;
  }

  const token = await accessToken();

  if (!token) {
    throw new SatuSehatConfigError("SATUSEHAT access token provider returned an empty token");
  }

  return token;
}

async function safeParseJson(response: Response): Promise<unknown> {
  const text = await response.text();

  if (!text) {
    return undefined;
  }

  try {
    return JSON.parse(text);
  } catch (cause) {
    throw new SatuSehatConfigError("Unable to parse SATUSEHAT auth response as JSON", { cause });
  }
}
