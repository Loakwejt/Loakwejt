import { NextResponse } from 'next/server';
import { z, ZodError } from 'zod';

/**
 * API Error Types
 */
export enum ApiErrorCode {
  // Client errors (4xx)
  BAD_REQUEST = 'BAD_REQUEST',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  NOT_FOUND = 'NOT_FOUND',
  CONFLICT = 'CONFLICT',
  RATE_LIMITED = 'RATE_LIMITED',
  PAYLOAD_TOO_LARGE = 'PAYLOAD_TOO_LARGE',
  
  // Server errors (5xx)
  INTERNAL_ERROR = 'INTERNAL_ERROR',
  SERVICE_UNAVAILABLE = 'SERVICE_UNAVAILABLE',
}

interface ApiError {
  code: ApiErrorCode;
  message: string;
  details?: unknown;
  requestId?: string;
}

interface ApiSuccess<T> {
  data: T;
  meta?: Record<string, unknown>;
}

type ApiResult<T> = ApiSuccess<T> | { error: ApiError };

/**
 * Standard API response helper
 */
export class ApiResponse {
  /**
   * Success response with data
   */
  static success<T>(data: T, meta?: Record<string, unknown>, status = 200) {
    const response: ApiSuccess<T> = { data };
    if (meta) {
      response.meta = meta;
    }
    return NextResponse.json(response, { status });
  }

  /**
   * Success response for created resources
   */
  static created<T>(data: T) {
    return this.success(data, undefined, 201);
  }

  /**
   * Success response with no content
   */
  static noContent() {
    return new NextResponse(null, { status: 204 });
  }

  /**
   * Error response
   */
  static error(
    code: ApiErrorCode,
    message: string,
    status: number,
    details?: unknown,
    headers?: Record<string, string>
  ) {
    const error: ApiError = { code, message };
    if (details) {
      error.details = details;
    }
    
    return NextResponse.json(
      { error },
      { status, headers }
    );
  }

  /**
   * Bad request (400)
   */
  static badRequest(message = 'Bad request', details?: unknown) {
    return this.error(ApiErrorCode.BAD_REQUEST, message, 400, details);
  }

  /**
   * Validation error (400)
   */
  static validationError(errors: ZodError | { field: string; message: string }[]) {
    const details = errors instanceof ZodError
      ? errors.errors.map(e => ({
          field: e.path.join('.'),
          message: e.message,
        }))
      : errors;

    return this.error(
      ApiErrorCode.VALIDATION_ERROR,
      'Validation failed',
      400,
      details
    );
  }

  /**
   * Unauthorized (401)
   */
  static unauthorized(message = 'Authentication required') {
    return this.error(ApiErrorCode.UNAUTHORIZED, message, 401);
  }

  /**
   * Forbidden (403)
   */
  static forbidden(message = 'Access denied') {
    return this.error(ApiErrorCode.FORBIDDEN, message, 403);
  }

  /**
   * Not found (404)
   */
  static notFound(resource = 'Resource') {
    return this.error(ApiErrorCode.NOT_FOUND, `${resource} not found`, 404);
  }

  /**
   * Conflict (409)
   */
  static conflict(message = 'Resource already exists') {
    return this.error(ApiErrorCode.CONFLICT, message, 409);
  }

  /**
   * Rate limited (429)
   */
  static rateLimited(retryAfter: number) {
    return this.error(
      ApiErrorCode.RATE_LIMITED,
      'Too many requests',
      429,
      undefined,
      { 'Retry-After': String(retryAfter) }
    );
  }

  /**
   * Payload too large (413)
   */
  static payloadTooLarge(maxSize: string) {
    return this.error(
      ApiErrorCode.PAYLOAD_TOO_LARGE,
      `Request payload exceeds maximum size of ${maxSize}`,
      413
    );
  }

  /**
   * Internal server error (500)
   */
  static internalError(message = 'An unexpected error occurred') {
    return this.error(ApiErrorCode.INTERNAL_ERROR, message, 500);
  }

  /**
   * Service unavailable (503)
   */
  static serviceUnavailable(message = 'Service temporarily unavailable') {
    return this.error(ApiErrorCode.SERVICE_UNAVAILABLE, message, 503);
  }
}

/**
 * API Route handler wrapper with error handling
 */
export function withErrorHandler<T>(
  handler: () => Promise<NextResponse<T>>
): Promise<NextResponse> {
  return handler().catch((error) => {
    console.error('API Error:', error);

    // Handle Zod validation errors
    if (error instanceof ZodError) {
      return ApiResponse.validationError(error);
    }

    // Handle known error types
    if (error instanceof Error) {
      if (error.message.includes('Unauthorized')) {
        return ApiResponse.unauthorized();
      }
      if (error.message.includes('Forbidden')) {
        return ApiResponse.forbidden(error.message);
      }
      if (error.message.includes('not found')) {
        return ApiResponse.notFound();
      }
    }

    // Default to internal error
    return ApiResponse.internalError();
  });
}

/**
 * Validate request body with Zod schema
 */
export async function validateBody<T extends z.ZodType>(
  request: Request,
  schema: T
): Promise<z.infer<T>> {
  const body = await request.json().catch(() => ({}));
  return schema.parse(body);
}

/**
 * Validate query parameters with Zod schema
 */
export function validateQuery<T extends z.ZodType>(
  url: URL,
  schema: T
): z.infer<T> {
  const params: Record<string, string> = {};
  url.searchParams.forEach((value, key) => {
    params[key] = value;
  });
  return schema.parse(params);
}
