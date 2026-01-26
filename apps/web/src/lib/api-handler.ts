import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { ZodError, ZodType } from 'zod';
import { authOptions } from './auth';
import { rateLimit, RATE_LIMITS, getRateLimitHeaders } from './rate-limit';
import { ApiResponse, ApiErrorCode } from './api-response';

type RateLimitType = keyof typeof RATE_LIMITS;

interface HandlerContext {
  userId: string;
  request: NextRequest;
  params: Record<string, string>;
}

interface ApiHandlerOptions {
  rateLimit?: RateLimitType;
  requireAuth?: boolean;
  bodySchema?: ZodType;
  querySchema?: ZodType;
}

type ApiHandlerFunction = (
  context: HandlerContext,
  body?: unknown,
  query?: unknown
) => Promise<NextResponse>;

/**
 * Creates a typed API handler with built-in:
 * - Authentication
 * - Rate limiting
 * - Body validation
 * - Query validation
 * - Error handling
 */
export function createApiHandler(
  handler: ApiHandlerFunction,
  options: ApiHandlerOptions = {}
) {
  const {
    rateLimit: rateLimitType = 'apiRead',
    requireAuth = true,
    bodySchema,
    querySchema,
  } = options;

  return async (
    request: NextRequest,
    { params }: { params: Record<string, string> }
  ): Promise<NextResponse> => {
    try {
      // Check authentication
      let userId = '';
      if (requireAuth) {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
          return ApiResponse.unauthorized();
        }
        userId = session.user.id;
      }

      // Apply rate limiting
      const identifier = userId || request.ip || 'anonymous';
      const rateLimitConfig = RATE_LIMITS[rateLimitType];
      const rateLimitResult = await rateLimit(identifier, rateLimitConfig);

      if (!rateLimitResult.allowed) {
        return NextResponse.json(
          {
            error: {
              code: ApiErrorCode.RATE_LIMITED,
              message: 'Too many requests',
            },
          },
          {
            status: 429,
            headers: getRateLimitHeaders(rateLimitResult),
          }
        );
      }

      // Validate body if schema provided
      let body: unknown;
      if (bodySchema && ['POST', 'PUT', 'PATCH'].includes(request.method)) {
        try {
          const rawBody = await request.json();
          body = bodySchema.parse(rawBody);
        } catch (error) {
          if (error instanceof ZodError) {
            return ApiResponse.validationError(error);
          }
          return ApiResponse.badRequest('Invalid request body');
        }
      }

      // Validate query parameters if schema provided
      let query: unknown;
      if (querySchema) {
        try {
          const searchParams = new URL(request.url).searchParams;
          const queryObj: Record<string, string> = {};
          searchParams.forEach((value, key) => {
            queryObj[key] = value;
          });
          query = querySchema.parse(queryObj);
        } catch (error) {
          if (error instanceof ZodError) {
            return ApiResponse.validationError(error);
          }
          return ApiResponse.badRequest('Invalid query parameters');
        }
      }

      // Execute handler
      const context: HandlerContext = {
        userId,
        request,
        params,
      };

      const response = await handler(context, body, query);

      // Add rate limit headers to response
      const headers = new Headers(response.headers);
      const rateLimitHeaders = getRateLimitHeaders(rateLimitResult);
      Object.entries(rateLimitHeaders).forEach(([key, value]) => {
        headers.set(key, value);
      });

      return new NextResponse(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers,
      });
    } catch (error) {
      console.error('API Handler Error:', error);

      // Handle known error types
      if (error instanceof ZodError) {
        return ApiResponse.validationError(error);
      }

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

      return ApiResponse.internalError();
    }
  };
}

/**
 * Convenience wrappers for common HTTP methods
 */
export const apiGet = (handler: ApiHandlerFunction, options?: Omit<ApiHandlerOptions, 'bodySchema'>) =>
  createApiHandler(handler, { ...options, rateLimit: options?.rateLimit || 'apiRead' });

export const apiPost = (handler: ApiHandlerFunction, options?: ApiHandlerOptions) =>
  createApiHandler(handler, { ...options, rateLimit: options?.rateLimit || 'apiWrite' });

export const apiPut = (handler: ApiHandlerFunction, options?: ApiHandlerOptions) =>
  createApiHandler(handler, { ...options, rateLimit: options?.rateLimit || 'apiWrite' });

export const apiPatch = (handler: ApiHandlerFunction, options?: ApiHandlerOptions) =>
  createApiHandler(handler, { ...options, rateLimit: options?.rateLimit || 'apiWrite' });

export const apiDelete = (handler: ApiHandlerFunction, options?: Omit<ApiHandlerOptions, 'bodySchema'>) =>
  createApiHandler(handler, { ...options, rateLimit: options?.rateLimit || 'apiWrite' });
