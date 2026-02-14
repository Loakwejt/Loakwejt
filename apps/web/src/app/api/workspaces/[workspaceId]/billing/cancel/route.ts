import { NextRequest, NextResponse } from 'next/server';
import { requireWorkspacePermission } from '@/lib/permissions';
import { cancelSubscription } from '@/lib/stripe';
import { createAuditLog } from '@/lib/audit';

// POST /api/workspaces/[workspaceId]/billing/cancel
// Kündigt das laufende Abo zum Periodenende
export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ workspaceId: string }> }
) {
  const { workspaceId } = await params;
  try {
    const { userId } = await requireWorkspacePermission(workspaceId, 'admin');

    await cancelSubscription(workspaceId);

    await createAuditLog({
      userId,
      action: 'SUBSCRIPTION_CANCELLED',
      entity: 'Workspace',
      entityId: workspaceId,
    });

    return NextResponse.json({
      success: true,
      message: 'Dein Abonnement wird zum Ende der aktuellen Abrechnungsperiode gekündigt.',
    });
  } catch (error) {
    if (error instanceof Error && error.message.includes('Forbidden')) {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }
    if (
      error instanceof Error &&
      error.message.includes('No active subscription')
    ) {
      return NextResponse.json(
        { error: 'Kein aktives Abonnement gefunden.' },
        { status: 400 }
      );
    }
    console.error('Cancel subscription error:', error);
    return NextResponse.json(
      { error: 'Fehler beim Kündigen des Abonnements' },
      { status: 500 }
    );
  }
}
