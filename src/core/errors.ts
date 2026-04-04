import type { ZodIssue } from "zod";

export class SatuSehatError extends Error {
  public override readonly cause?: unknown;

  public constructor(message: string, options?: { cause?: unknown }) {
    super(message);
    this.name = "SatuSehatError";
    this.cause = options?.cause;
  }
}

export class SatuSehatConfigError extends SatuSehatError {
  public constructor(message: string, options?: { cause?: unknown }) {
    super(message, options);
    this.name = "SatuSehatConfigError";
  }
}

export class SatuSehatValidationError extends SatuSehatError {
  public readonly issues: ZodIssue[];

  public constructor(message: string, issues: ZodIssue[], options?: { cause?: unknown }) {
    super(message, options);
    this.name = "SatuSehatValidationError";
    this.issues = issues;
  }
}

export class SatuSehatApiError extends SatuSehatError {
  public readonly status: number;
  public readonly response: unknown;

  public constructor(
    message: string,
    status: number,
    response: unknown,
    options?: { cause?: unknown },
  ) {
    super(message, options);
    this.name = "SatuSehatApiError";
    this.status = status;
    this.response = response;
  }
}
