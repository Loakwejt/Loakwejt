/**
 * Input sanitization utilities
 */

/**
 * Sanitize a string to prevent XSS
 * Escapes HTML special characters
 */
export function escapeHtml(str: string): string {
  const htmlEscapes: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;',
  };
  
  return str.replace(/[&<>"'/]/g, (char) => htmlEscapes[char] ?? char);
}

/**
 * Sanitize string for safe database storage
 * Removes null bytes and trims whitespace
 */
export function sanitizeString(str: string, options?: {
  maxLength?: number;
  trimWhitespace?: boolean;
  removeNullBytes?: boolean;
}): string {
  const {
    maxLength,
    trimWhitespace = true,
    removeNullBytes = true,
  } = options || {};

  let result = str;

  // Remove null bytes
  if (removeNullBytes) {
    result = result.replace(/\0/g, '');
  }

  // Trim whitespace
  if (trimWhitespace) {
    result = result.trim();
  }

  // Truncate to max length
  if (maxLength && result.length > maxLength) {
    result = result.slice(0, maxLength);
  }

  return result;
}

/**
 * Sanitize slug - only allow alphanumeric, hyphens, and underscores
 */
export function sanitizeSlug(slug: string): string {
  return slug
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9-_]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

/**
 * Sanitize filename - remove path separators and null bytes
 */
export function sanitizeFilename(filename: string): string {
  return filename
    .replace(/\0/g, '')
    .replace(/[/\\:*?"<>|]/g, '_')
    .replace(/\.{2,}/g, '.')
    .trim();
}

/**
 * Sanitize URL - validate and clean
 */
export function sanitizeUrl(url: string): string | null {
  try {
    const parsed = new URL(url);
    
    // Only allow http and https protocols
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      return null;
    }
    
    return parsed.toString();
  } catch {
    return null;
  }
}

/**
 * Sanitize email
 */
export function sanitizeEmail(email: string): string {
  return email.toLowerCase().trim();
}

/**
 * Check if string contains potential SQL injection
 */
export function containsSqlInjection(str: string): boolean {
  const sqlPatterns = [
    /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|UNION|ALTER|CREATE|TRUNCATE)\b)/i,
    /(--)|(;)|(\/\*)|(\*\/)/,
    /(OR|AND)\s+\d+\s*=\s*\d+/i,
  ];
  
  return sqlPatterns.some(pattern => pattern.test(str));
}

/**
 * Remove potential script injection from rich text
 * Note: This is a basic sanitizer. For production, use DOMPurify or similar.
 */
export function sanitizeRichText(html: string): string {
  // Remove script tags
  let clean = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  
  // Remove event handlers
  clean = clean.replace(/\s*on\w+\s*=\s*["'][^"']*["']/gi, '');
  
  // Remove javascript: URLs
  clean = clean.replace(/javascript:/gi, '');
  
  // Remove data: URLs (potential XSS vector)
  clean = clean.replace(/data:/gi, '');
  
  // Remove style tags (can contain expressions)
  clean = clean.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '');
  
  return clean;
}

/**
 * Recursively sanitize object properties
 */
export function sanitizeObject<T extends Record<string, unknown>>(
  obj: T,
  options?: {
    maxStringLength?: number;
    maxDepth?: number;
    stripNull?: boolean;
  }
): T {
  const { maxStringLength = 10000, maxDepth = 10, stripNull = false } = options || {};

  function sanitize(value: unknown, depth: number): unknown {
    if (depth > maxDepth) {
      return null;
    }

    if (value === null) {
      return stripNull ? undefined : null;
    }

    if (typeof value === 'string') {
      return sanitizeString(value, { maxLength: maxStringLength });
    }

    if (Array.isArray(value)) {
      return value.map(item => sanitize(item, depth + 1));
    }

    if (typeof value === 'object' && value !== null) {
      const result: Record<string, unknown> = {};
      for (const [key, val] of Object.entries(value)) {
        const sanitizedKey = sanitizeString(key, { maxLength: 100 });
        result[sanitizedKey] = sanitize(val, depth + 1);
      }
      return result;
    }

    return value;
  }

  return sanitize(obj, 0) as T;
}

/**
 * Validate and sanitize pagination parameters
 */
export function sanitizePagination(params: {
  page?: string | number;
  limit?: string | number;
  maxLimit?: number;
}): { page: number; limit: number } {
  const { maxLimit = 100 } = params;
  
  let page = typeof params.page === 'string' ? parseInt(params.page, 10) : (params.page || 1);
  let limit = typeof params.limit === 'string' ? parseInt(params.limit, 10) : (params.limit || 20);

  // Ensure valid numbers
  if (isNaN(page) || page < 1) page = 1;
  if (isNaN(limit) || limit < 1) limit = 20;
  if (limit > maxLimit) limit = maxLimit;

  return { page, limit };
}
