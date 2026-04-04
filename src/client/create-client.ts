import { createClientCredentialsTokenProvider } from "./auth";
import { createFileTokenStore, createMemoryTokenStore } from "./token-store";
import { createTransport } from "./transport";
import { createConditionClient } from "../endpoints/condition";
import { createEncounterClient } from "../endpoints/encounter";
import { createLocationClient } from "../endpoints/location";
import { createMedicationClient } from "../endpoints/medication";
import { createMedicationRequestClient } from "../endpoints/medication-request";
import { createObservationClient } from "../endpoints/observation";
import { createOrganizationClient } from "../endpoints/organization";
import { createPatientClient } from "../endpoints/patient";
import { createPractitionerClient } from "../endpoints/practitioner";
import { createPractitionerRoleClient } from "../endpoints/practitioner-role";
import { createProcedureClient } from "../endpoints/procedure";
import { createServiceRequestClient } from "../endpoints/service-request";
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
  const authStrategy = resolveClientAccessToken(config, authBaseUrl);
  const transport = createTransport({
    baseUrl,
    ...(authStrategy?.accessToken ? { accessToken: authStrategy.accessToken } : {}),
    ...(authStrategy?.invalidateAccessToken
      ? { invalidateAccessToken: authStrategy.invalidateAccessToken }
      : {}),
    ...(config.retryOnUnauthorized !== undefined
      ? { retryOnUnauthorized: config.retryOnUnauthorized }
      : {}),
    ...(config.defaultHeaders ? { defaultHeaders: config.defaultHeaders } : {}),
    ...(config.fetch ? { fetch: config.fetch } : {}),
    ...(config.validateResponse !== undefined
      ? { validateResponse: config.validateResponse }
      : {}),
  });

  return {
    condition: createConditionClient(transport),
    encounter: createEncounterClient(transport),
    location: createLocationClient(transport),
    medication: createMedicationClient(transport),
    medicationRequest: createMedicationRequestClient(transport),
    observation: createObservationClient(transport),
    organization: createOrganizationClient(transport),
    patient: createPatientClient(transport),
    practitioner: createPractitionerClient(transport),
    practitionerRole: createPractitionerRoleClient(transport),
    procedure: createProcedureClient(transport),
    serviceRequest: createServiceRequestClient(transport),
  };
}

export function createSatuSehatClientFromEnv(
  env: SatuSehatEnvSource = process.env as SatuSehatEnvSource,
  overrides: Omit<SatuSehatClientConfig, "environment" | "baseUrl" | "authBaseUrl" | "credentials"> = {},
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
    ...overrides,
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
): {
  accessToken?: AccessTokenProvider;
  invalidateAccessToken?: () => Promise<void>;
} | undefined {
  if (config.accessToken) {
    return {
      accessToken: config.accessToken,
    };
  }

  if (!config.credentials) {
    return undefined;
  }

  if (!config.credentials.clientId || !config.credentials.clientSecret) {
    throw new SatuSehatConfigError("SATUSEHAT credentials must include clientId and clientSecret");
  }

  const tokenStore = config.tokenStore ?? createMemoryTokenStore();
  const accessToken = createClientCredentialsTokenProvider({
    authBaseUrl,
    clientId: config.credentials.clientId,
    clientSecret: config.credentials.clientSecret,
    tokenStore,
    ...(config.tokenExpiryWindowMs !== undefined
      ? { tokenExpiryWindowMs: config.tokenExpiryWindowMs }
      : {}),
    ...(config.fetch ? { fetch: config.fetch } : {}),
  });

  return {
    accessToken,
    ...(tokenStore.clearToken
      ? {
          invalidateAccessToken: async () => {
            await tokenStore.clearToken?.();
          },
        }
      : {}),
  };
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
