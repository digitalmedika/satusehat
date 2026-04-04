import { createClientCredentialsTokenProvider } from "./auth";
import { createFileTokenStore } from "./token-store";
import { createTransport } from "./transport";
import { createPatientClient } from "../endpoints/patient";
import { SatuSehatConfigError } from "../core/errors";
import {
  type AccessTokenProvider,
  type SatuSehatClient,
  type SatuSehatClientConfig,
  type SatuSehatEnvironment,
  type SatuSehatEnvSource,
} from "../core/types";

const DEFAULT_BASE_URLS: Record<SatuSehatEnvironment, string> = {
  sandbox: "https://api-satusehat-stg.dto.kemkes.go.id/fhir-r4/v1",
  production: "https://api-satusehat.kemkes.go.id/fhir-r4/v1",
};

const DEFAULT_AUTH_BASE_URLS: Record<SatuSehatEnvironment, string> = {
  sandbox: "https://api-satusehat-stg.dto.kemkes.go.id/oauth2/v1",
  production: "https://api-satusehat.kemkes.go.id/oauth2/v1",
};

export function createSatuSehatClient(config: SatuSehatClientConfig = {}): SatuSehatClient {
  const environment = config.environment ?? "sandbox";
  const baseUrl = config.baseUrl ?? resolveSatuSehatBaseUrl(environment);
  const authBaseUrl = config.authBaseUrl ?? resolveSatuSehatAuthBaseUrl(environment);
  const accessToken = resolveClientAccessToken(config, authBaseUrl);
  const transport = createTransport({
    baseUrl,
    ...(accessToken ? { accessToken } : {}),
    ...(config.defaultHeaders ? { defaultHeaders: config.defaultHeaders } : {}),
    ...(config.fetch ? { fetch: config.fetch } : {}),
    ...(config.validateResponse !== undefined
      ? { validateResponse: config.validateResponse }
      : {}),
  });

  return {
    patient: createPatientClient(transport),
  };
}

export function createSatuSehatClientFromEnv(
  env: SatuSehatEnvSource = process.env as SatuSehatEnvSource,
): SatuSehatClient {
  const environment = parseEnvironment(env.SATUSEHAT_ENV);

  return createSatuSehatClient({
    ...(environment ? { environment } : {}),
    ...(env.SATUSEHAT_BASE_URL ? { baseUrl: env.SATUSEHAT_BASE_URL } : {}),
    ...(env.SATUSEHAT_AUTH_BASE_URL ? { authBaseUrl: env.SATUSEHAT_AUTH_BASE_URL } : {}),
    ...(env.SATUSEHAT_CLIENT_ID && env.SATUSEHAT_CLIENT_SECRET
      ? {
          credentials: {
            clientId: env.SATUSEHAT_CLIENT_ID,
            clientSecret: env.SATUSEHAT_CLIENT_SECRET,
          },
        }
      : {}),
    ...(env.SATUSEHAT_TOKEN_CACHE_FILE
      ? {
          tokenStore: createFileTokenStore({
            filePath: env.SATUSEHAT_TOKEN_CACHE_FILE,
          }),
        }
      : {}),
  });
}

export function resolveSatuSehatBaseUrl(environment: SatuSehatEnvironment): string {
  return DEFAULT_BASE_URLS[environment];
}

export function resolveSatuSehatAuthBaseUrl(environment: SatuSehatEnvironment): string {
  return DEFAULT_AUTH_BASE_URLS[environment];
}

function resolveClientAccessToken(
  config: SatuSehatClientConfig,
  authBaseUrl: string,
): AccessTokenProvider | undefined {
  if (config.accessToken) {
    return config.accessToken;
  }

  if (!config.credentials) {
    return undefined;
  }

  if (!config.credentials.clientId || !config.credentials.clientSecret) {
    throw new SatuSehatConfigError("SATUSEHAT credentials must include clientId and clientSecret");
  }

  return createClientCredentialsTokenProvider({
    authBaseUrl,
    clientId: config.credentials.clientId,
    clientSecret: config.credentials.clientSecret,
    ...(config.tokenStore ? { tokenStore: config.tokenStore } : {}),
    ...(config.tokenExpiryWindowMs !== undefined
      ? { tokenExpiryWindowMs: config.tokenExpiryWindowMs }
      : {}),
    ...(config.fetch ? { fetch: config.fetch } : {}),
  });
}

function parseEnvironment(input?: string): SatuSehatEnvironment | undefined {
  if (!input) {
    return undefined;
  }

  if (input === "sandbox" || input === "production") {
    return input;
  }

  throw new SatuSehatConfigError(
    `Invalid SATUSEHAT_ENV value "${input}". Expected "sandbox" or "production".`,
  );
}
