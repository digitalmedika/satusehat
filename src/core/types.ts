export type MaybePromise<T> = T | Promise<T>;

export type SatuSehatEnvironment = "sandbox" | "production";

export type FetchLike = (
  input: string | URL | Request,
  init?: RequestInit,
) => Promise<Response>;

export type PrimitiveQueryValue = string | number | boolean | Date;

export type QueryParams = Record<
  string,
  PrimitiveQueryValue | PrimitiveQueryValue[] | null | undefined
>;

export type AccessTokenProvider = string | (() => MaybePromise<string>);

export interface OAuthClientCredentials {
  clientId: string;
  clientSecret: string;
}

export interface SatuSehatClientConfig {
  baseUrl?: string;
  authBaseUrl?: string;
  environment?: SatuSehatEnvironment;
  accessToken?: AccessTokenProvider;
  credentials?: OAuthClientCredentials;
  defaultHeaders?: HeadersInit;
  fetch?: FetchLike;
  validateResponse?: boolean;
}

export interface SatuSehatEnvSource {
  SATUSEHAT_ENV?: string;
  SATUSEHAT_BASE_URL?: string;
  SATUSEHAT_AUTH_BASE_URL?: string;
  SATUSEHAT_CLIENT_ID?: string;
  SATUSEHAT_CLIENT_SECRET?: string;
  [key: string]: string | undefined;
}

export interface PatientClient {
  getById(input: { id: string; signal?: AbortSignal }): Promise<import("../schemas/patient").Patient>;
  search(
    input: import("../schemas/patient").PatientSearchParams,
    signal?: AbortSignal,
  ): Promise<import("../schemas/patient").PatientSearchResponse>;
}

export interface SatuSehatClient {
  patient: PatientClient;
}
