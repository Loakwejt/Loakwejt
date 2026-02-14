import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@builderly/db';
import { getCurrentUser } from '@/lib/permissions';

async function requireAdmin() {
  const user = await getCurrentUser();
  if (!user) throw new Error('Unauthorized');
  const membership = await prisma.workspaceMember.findFirst({
    where: { userId: user.id, role: { in: ['OWNER', 'ADMIN'] } },
  });
  if (!membership) throw new Error('Forbidden');
  return user;
}

// Mask sensitive strings: show first 4 + last 4 chars
function mask(value: string | null | undefined): string | null {
  if (!value) return null;
  if (value.length <= 10) return '••••••••';
  return value.slice(0, 4) + '••••••••' + value.slice(-4);
}

// GET /api/admin/users/[userId]
export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    await requireAdmin();
    const { userId } = params;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        image: true,
        emailVerified: true,
        createdAt: true,
        updatedAt: true,
        privacyConsentAt: true,
        privacyConsentVersion: true,
        marketingConsent: true,
        marketingConsentAt: true,
        isActive: true,
        deletedAt: true,
        anonymizedAt: true,
        // Accounts — mask tokens
        accounts: {
          select: {
            id: true,
            type: true,
            provider: true,
            providerAccountId: true,
            refresh_token: true,
            access_token: true,
            expires_at: true,
            token_type: true,
            scope: true,
            id_token: true,
            session_state: true,
          },
        },
        // Active sessions
        sessions: {
          select: {
            id: true,
            expires: true,
            ipAddress: true,
            userAgent: true,
            deviceType: true,
            lastActive: true,
            createdAt: true,
          },
          orderBy: { lastActive: 'desc' },
        },
        // Workspace memberships
        memberships: {
          select: {
            id: true,
            role: true,
            createdAt: true,
            workspace: {
              select: {
                id: true,
                name: true,
                slug: true,
                plan: true,
                createdAt: true,
              },
            },
          },
        },
        // Audit logs (last 50)
        auditLogs: {
          select: {
            id: true,
            action: true,
            entity: true,
            entityId: true,
            details: true,
            ipAddress: true,
            createdAt: true,
          },
          orderBy: { createdAt: 'desc' },
          take: 50,
        },
        // Data export requests
        dataExports: {
          select: {
            id: true,
            status: true,
            createdAt: true,
            processedAt: true,
            expiresAt: true,
          },
          orderBy: { createdAt: 'desc' },
        },
        // Password resets (metadata only, no tokens)
        passwordResets: {
          select: {
            id: true,
            used: true,
            usedAt: true,
            createdAt: true,
            expires: true,
            ipAddress: true,
          },
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
        // Counts
        _count: {
          select: {
            memberships: true,
            createdPages: true,
            revisions: true,
            records: true,
            assets: true,
            auditLogs: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'Benutzer nicht gefunden' }, { status: 404 });
    }

    // Mask sensitive fields on accounts
    const safeAccounts = user.accounts.map((acc) => ({
      id: acc.id,
      type: acc.type,
      provider: acc.provider,
      providerAccountId: mask(acc.providerAccountId),
      refresh_token: mask(acc.refresh_token),
      access_token: mask(acc.access_token),
      expires_at: acc.expires_at,
      token_type: acc.token_type,
      scope: acc.scope,
      id_token: mask(acc.id_token),
      session_state: mask(acc.session_state),
    }));

    // Mask session tokens (sessionToken not selected, but mask IPs partially)
    const safeSessions = user.sessions.map((s) => ({
      ...s,
      // Keep IP for admin visibility but it's already not a secret
    }));

    return NextResponse.json({
      ...user,
      passwordHash: undefined, // Never expose
      accounts: safeAccounts,
      sessions: safeSessions,
    });
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Nicht eingeloggt' }, { status: 401 });
    }
    if (error instanceof Error && error.message === 'Forbidden') {
      return NextResponse.json({ error: 'Keine Berechtigung' }, { status: 403 });
    }
    console.error('Admin user detail error:', error);
    return NextResponse.json({ error: 'Fehler beim Laden' }, { status: 500 });
  }
}
