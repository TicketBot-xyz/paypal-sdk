import { PayPalErrorDetail } from './types';

export abstract class PayPalError extends Error {
  abstract readonly type: string;
  
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class PayPalAPIError extends PayPalError {
  readonly type = 'api_error';
  readonly httpStatusCode: number;
  readonly code: string;
  readonly debugId?: string | undefined;
  readonly details: PayPalErrorDetail[];

  constructor(
    message: string,
    httpStatusCode: number,
    code: string,
    debugId?: string,
    details: PayPalErrorDetail[] = []
  ) {
    super(message);
    this.httpStatusCode = httpStatusCode;
    this.code = code;
    this.debugId = debugId;
    this.details = details;
  }
}

export class PayPalConnectionError extends PayPalError {
  readonly type = 'connection_error';
  readonly originalError: any;

  constructor(message: string, originalError?: any) {
    super(message);
    this.originalError = originalError;
  }
}

export class PayPalAuthenticationError extends PayPalError {
  readonly type = 'authentication_error';
  
  constructor(message: string = 'Invalid PayPal credentials') {
    super(message);
  }
}

export class PayPalInvalidRequestError extends PayPalError {
  readonly type = 'invalid_request_error';
  readonly param?: string | undefined;

  constructor(message: string, param?: string) {
    super(message);
    this.param = param;
  }
}

export class PayPalIdempotencyError extends PayPalError {
  readonly type = 'idempotency_error';
  
  constructor(message: string = 'Idempotency key already used') {
    super(message);
  }
}

export class PayPalRateLimitError extends PayPalError {
  readonly type = 'rate_limit_error';
  
  constructor(message: string = 'Too many requests made to PayPal API') {
    super(message);
  }
} 