import { type ZodTypeAny } from "zod";

import { resolveAccessToken } from "./auth";
import { SatuSehatApiError, SatuSehatValidationError } from "../core/errors";
import { type AccessTokenProvider, type FetchLike, type QueryParams } from "../core/types";

export interface TransportOptions {
  baseUrl: string;
  accessToken?: AccessTokenProvider;
  invalidateAccessToken?: () => Promise<void>;
  retryOnUnauthorized?: boolean;
  defaultHeaders?: HeadersInit;
  fetch?: FetchLike;
  validateResponse?: boolean;
}

export interface RequestOptions<TQuerySchema extends ZodTypeAny | undefined, TResponseSchema extends ZodTypeAny> {
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  path: string;
  query?: unknown;
  querySchema?: TQuerySchema;
  headers?: HeadersInit;
  signal?: AbortSignal;
  responseSchema: TResponseSchema;
}

export interface Transport {
  request<TQuerySchema extends ZodTypeAny | undefined, TResponseSchema extends ZodTypeAny>(
    options: RequestOptions<TQuerySchema, TResponseSchema>,
  ): Promise<InferSchema<TResponseSchema>>;
}

type InferSchema<TSchema extends ZodTypeAny> = TSchema["_output"];

export function createTransport(options: TransportOptions): Transport {
  const httpClient = options.fetch ?? fetch;
  const baseUrl = options.baseUrl.replace(/\/$/, "");
  const validateResponse = options.validateResponse ?? true;
  const retryOnUnauthorized = options.retryOnUnauthorized ?? true;

  return {
    async request<TQuerySchema extends ZodTypeAny | undefined, TResponseSchema extends ZodTypeAny>(
      requestOptions: RequestOptions<TQuerySchema, TResponseSchema>,
    ): Promise<InferSchema<TResponseSchema>> {
      const query = validateQuery(requestOptions.querySchema, requestOptions.query);
      const url = new URL(`${baseUrl}${requestOptions.path}`);

      appendQuery(url, query);

      const execute = async (): Promise<Response> => {
        const token = await resolveAccessToken(options.accessToken);

        return httpClient(url, {
          method: requestOptions.method,
          headers: {
            accept: "application/json",
            ...(token ? { authorization: `Bearer ${token}` } : {}),
            ...options.defaultHeaders,
            ...requestOptions.headers,
          },
          ...(requestOptions.signal ? { signal: requestOptions.signal } : {}),
        });
      };

      let response = await execute();
      let payload = await readResponsePayload(response);

      if (
        response.status === 401 &&
        retryOnUnauthorized &&
        options.invalidateAccessToken
      ) {
        await options.invalidateAccessToken();
        response = await execute();
        payload = await readResponsePayload(response);
      }

      if (!response.ok) {
        throw new SatuSehatApiError(
          `SATUSEHAT request failed with status ${response.status}`,
          response.status,
          payload,
        );
      }

      if (!validateResponse) {
        return payload as InferSchema<TResponseSchema>;
      }

      const parsed = requestOptions.responseSchema.safeParse(payload);

      if (!parsed.success) {
        throw new SatuSehatValidationError(
          "SATUSEHAT response validation failed",
          parsed.error.issues,
        );
      }

      return parsed.data;
    },
  };
}

function validateQuery<TQuerySchema extends ZodTypeAny | undefined>(
  schema: TQuerySchema,
  input: unknown,
): QueryParams | undefined {
  if (!schema || input == null) {
    return input as QueryParams | undefined;
  }

  const parsed = schema.safeParse(input);

  if (!parsed.success) {
    throw new SatuSehatValidationError(
      "SATUSEHAT request query validation failed",
      parsed.error.issues,
    );
  }

  return parsed.data as QueryParams;
}

function appendQuery(url: URL, query?: QueryParams): void {
  if (!query) {
    return;
  }

  for (const [key, rawValue] of Object.entries(query)) {
    if (rawValue == null) {
      continue;
    }

    if (Array.isArray(rawValue)) {
      for (const item of rawValue) {
        url.searchParams.append(key, stringifyQueryValue(item));
      }

      continue;
    }

    url.searchParams.set(key, stringifyQueryValue(rawValue));
  }
}

function stringifyQueryValue(value: string | number | boolean | Date): string {
  if (value instanceof Date) {
    return value.toISOString();
  }

  return String(value);
}

async function readResponsePayload(response: Response): Promise<unknown> {
  const contentType = response.headers.get("content-type") ?? "";

  if (contentType.includes("application/json")) {
    const text = await response.text();
    return text ? JSON.parse(text) : undefined;
  }

  return response.text();
}
