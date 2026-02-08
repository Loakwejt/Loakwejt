import { prisma } from '@builderly/db';
import { headers } from 'next/headers';

interface AuditLogParams {
  userId?: string | null;
  action: string;
  entity?: string;
  entityId?: string;
  details?: Record<string, unknown>;
  /** Pass request headers if calling from a context where next/headers is not available */
  reqHeaders?: Headers;
}

/**
 * Create an audit log entry. Fire-and-forget by default — never throws.
 * Use this for every mutating action across the app.
 */
export async function createAuditLog({
  userId,
  action,
  entity,
  entityId,
  details,
  reqHeaders,
}: AuditLogParams): Promise<void> {
  try {
    let ip: string | null = null;
    let ua: string | null = null;

    try {
      const h = reqHeaders ?? headers();
      ip =
        h.get('x-forwarded-for')?.split(',')[0]?.trim() ??
        h.get('x-real-ip') ??
        null;
      ua = h.get('user-agent') ?? null;
    } catch {
      // headers() can throw outside of request context
    }

    await prisma.auditLog.create({
      data: {
        userId: userId ?? undefined,
        action,
        entity: entity ?? undefined,
        entityId: entityId ?? undefined,
        details: details ?? undefined,
        ipAddress: ip ?? undefined,
        userAgent: ua ?? undefined,
      },
    });
  } catch (err) {
    // Never let audit logging break the main request
    console.error('[AuditLog] Failed to write:', action, err);
  }
}
