import { NextRequest, NextResponse } from 'next/server';
import { requireWorkspacePermission } from '@/lib/permissions';
import { createPortalSession } from '@/lib/stripe';
import { createAuditLog } from '@/lib/audit';

// POST /api/workspaces/[workspaceId]/billing/portal
// Erstellt eine Stripe Customer Portal Session
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ workspaceId: string }> }
) {
  const { workspaceId } = await params;
  try {
    const { userId } = await requireWorkspacePermission(workspaceId, 'admin');

    const body = await request.json();
    const returnUrl =
      body.returnUrl ||
      `${process.env.NEXTAUTH_URL}/dashboard/workspaces/${workspaceId}/settings`;

    const session = await createPortalSession(workspaceId, returnUrl);

    await createAuditLog({
      userId,
      action: 'BILLING_PORTAL_OPENED',
      entity: 'Workspace',
      entityId: workspaceId,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    if (error instanceof Error && error.message.includes('Forbidden')) {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }
    if (
      error instanceof Error &&
      error.message.includes('No billing account')
    ) {
      return NextResponse.json(
        { error: 'Kein Zahlungskonto gefunden. Bitte erstelle zuerst ein Abonnement.' },
        { status: 400 }
      );
    }
    console.error('Portal session error:', error);
    return NextResponse.json(
      { error: 'Fehler beim Öffnen des Kundenportals' },
      { status: 500 }
    );
  }
}
