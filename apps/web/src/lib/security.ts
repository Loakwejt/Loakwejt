/**
 * Security utilities for input validation and protection
 */

import { NextRequest } from 'next/server';

/**
 * Content type validation
 */
export function validateContentType(
  request: NextRequest,
  allowedTypes: string[] = ['application/json']
): boolean {
  const contentType = request.headers.get('content-type');
  if (!contentType) return false;
  
  return allowedTypes.some(type => contentType.includes(type));
}

/**
 * Request size validation
 */
export function validateRequestSize(
  request: NextRequest,
  maxSizeBytes: number
): boolean {
  const contentLength = request.headers.get('content-length');
  if (!contentLength) return true; // Allow if not specified
  
  const size = parseInt(contentLength, 10);
  return !isNaN(size) && size <= maxSizeBytes;
}

/**
 * Origin validation for CSRF protection
 */
export function validateOrigin(
  request: NextRequest,
  allowedOrigins: string[]
): boolean {
  const origin = request.headers.get('origin');
  const referer = request.headers.get('referer');
  
  // No origin header for same-origin requests
  if (!origin && !referer) return true;
  
  if (origin && allowedOrigins.includes(origin)) return true;
  
  if (referer) {
    try {
      const refererUrl = new URL(referer);
      return allowedOrigins.includes(refererUrl.origin);
    } catch {
      return false;
    }
  }
  
  return false;
}

/**
 * Check for common attack patterns in string
 */
export function checkForAttackPatterns(str: string): {
  safe: boolean;
  patterns: string[];
} {
  const detectedPatterns: string[] = [];
  
  // SQL Injection patterns
  const sqlPatterns = [
    { regex: /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|UNION|ALTER|CREATE|TRUNCATE|EXEC|EXECUTE)\b)/i, name: 'SQL Keyword' },
    { regex: /('|")\s*(OR|AND)\s*('|"|\d)/i, name: 'SQL OR/AND injection' },
    { regex: /;\s*(DROP|DELETE|UPDATE|INSERT)/i, name: 'SQL chained command' },
  ];
  
  // XSS patterns
  const xssPatterns = [
    { regex: /<script\b/i, name: 'Script tag' },
    { regex: /javascript:/i, name: 'JavaScript protocol' },
    { regex: /on\w+\s*=/i, name: 'Event handler' },
    { regex: /<iframe\b/i, name: 'Iframe tag' },
    { regex: /<object\b/i, name: 'Object tag' },
    { regex: /<embed\b/i, name: 'Embed tag' },
  ];
  
  // Path traversal patterns
  const pathPatterns = [
    { regex: /\.\.\/|\.\.\\/, name: 'Path traversal' },
    { regex: /%2e%2e%2f|%2e%2e%5c/i, name: 'Encoded path traversal' },
  ];
  
  // Command injection patterns
  const cmdPatterns = [
    { regex: /[;&|`$]/, name: 'Shell metacharacter' },
    { regex: /\$\([^)]+\)/, name: 'Command substitution' },
  ];
  
  const allPatterns = [...sqlPatterns, ...xssPatterns, ...pathPatterns, ...cmdPatterns];
  
  for (const pattern of allPatterns) {
    if (pattern.regex.test(str)) {
      detectedPatterns.push(pattern.name);
    }
  }
  
  return {
    safe: detectedPatterns.length === 0,
    patterns: detectedPatterns,
  };
}

/**
 * Generate a cryptographically secure random string
 */
export function generateSecureToken(length = 32): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  
  let result = '';
  for (let i = 0; i < length; i++) {
    const byte = array[i];
    if (byte !== undefined) {
      result += chars[byte % chars.length];
    }
  }
  return result;
}

/**
 * HMAC signature generation for webhooks
 */
export async function generateHmacSignature(
  payload: string,
  secret: string
): Promise<string> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  
  const signature = await crypto.subtle.sign(
    'HMAC',
    key,
    encoder.encode(payload)
  );
  
  return Array.from(new Uint8Array(signature))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

/**
 * Verify HMAC signature
 */
export async function verifyHmacSignature(
  payload: string,
  signature: string,
  secret: string
): Promise<boolean> {
  const expectedSignature = await generateHmacSignature(payload, secret);
  
  // Constant-time comparison
  if (signature.length !== expectedSignature.length) {
    return false;
  }
  
  let result = 0;
  for (let i = 0; i < signature.length; i++) {
    result |= signature.charCodeAt(i) ^ expectedSignature.charCodeAt(i);
  }
  
  return result === 0;
}

/**
 * Hash sensitive data (like passwords) - for display purposes
 */
export function maskSensitiveData(data: string, visibleChars = 4): string {
  if (data.length <= visibleChars) {
    return '*'.repeat(data.length);
  }
  return data.slice(0, visibleChars) + '*'.repeat(Math.min(data.length - visibleChars, 8));
}

/**
 * Sanitize log output to prevent log injection
 */
export function sanitizeForLog(str: string): string {
  return str
    .replace(/\r/g, '\\r')
    .replace(/\n/g, '\\n')
    .replace(/\t/g, '\\t')
    .slice(0, 1000); // Limit log entry size
}

/**
 * Extract safe error information for logging
 */
export function getSafeErrorInfo(error: unknown): {
  message: string;
  name: string;
  stack?: string;
} {
  if (error instanceof Error) {
    return {
      message: sanitizeForLog(error.message),
      name: error.name,
      stack: error.stack ? sanitizeForLog(error.stack.split('\n').slice(0, 5).join('\n')) : undefined,
    };
  }
  
  return {
    message: String(error),
    name: 'Unknown',
  };
}
