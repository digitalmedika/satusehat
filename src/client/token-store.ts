import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { dirname } from "node:path";
import { z } from "zod";

import { SatuSehatConfigError } from "../core/errors";
import type { StoredAccessToken, TokenExpiryCheckOptions, TokenStore } from "../core/types";

const StoredAccessTokenSchema = z.object({
  accessToken: z.string().min(1),
  tokenType: z.string().min(1),
  expiresAt: z.number().finite(),
  expiresIn: z.number().finite().positive(),
  issuedAt: z.number().finite(),
});

export interface FileTokenStoreOptions {
  filePath: string;
}

export function createMemoryTokenStore(initialToken?: StoredAccessToken): TokenStore {
  let currentToken = initialToken;

  return {
    getToken() {
      return currentToken;
    },
    setToken(token) {
      currentToken = token;
    },
    clearToken() {
      currentToken = undefined;
    },
  };
}

export function createFileTokenStore(options: FileTokenStoreOptions): TokenStore {
  const filePath = options.filePath;

  return {
    async getToken() {
      try {
        const raw = await readFile(filePath, "utf8");
        const parsed = StoredAccessTokenSchema.safeParse(JSON.parse(raw));

        if (!parsed.success) {
          throw new SatuSehatConfigError("SATUSEHAT token cache file is invalid", {
            cause: parsed.error,
          });
        }

        return parsed.data;
      } catch (error) {
        if (isFileNotFoundError(error)) {
          return undefined;
        }

        if (error instanceof SyntaxError) {
          throw new SatuSehatConfigError("SATUSEHAT token cache file contains invalid JSON", {
            cause: error,
          });
        }

        throw error;
      }
    },

    async setToken(token) {
      await mkdir(dirname(filePath), { recursive: true });
      await writeFile(filePath, JSON.stringify(token, null, 2), "utf8");
    },

    async clearToken() {
      try {
        await rm(filePath, { force: true });
      } catch (error) {
        if (!isFileNotFoundError(error)) {
          throw error;
        }
      }
    },
  };
}

export function isAccessTokenExpired(
  token: Pick<StoredAccessToken, "expiresAt">,
  options: TokenExpiryCheckOptions = {},
): boolean {
  const now = options.now ?? Date.now();
  const safetyWindowMs = options.safetyWindowMs ?? 30_000;

  return token.expiresAt <= now + safetyWindowMs;
}

function isFileNotFoundError(error: unknown): error is NodeJS.ErrnoException {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as NodeJS.ErrnoException).code === "ENOENT"
  );
}
