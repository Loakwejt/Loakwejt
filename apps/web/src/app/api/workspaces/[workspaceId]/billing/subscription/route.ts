import { NextRequest, NextResponse } from 'next/server';
import { requireWorkspacePermission } from '@/lib/permissions';
import { prisma } from '@builderly/db';
import { stripe } from '@/lib/stripe';

// GET /api/workspaces/[workspaceId]/billing/subscription
// Gibt den aktuellen Subscription-Status zurück
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ workspaceId: string }> }
) {
  const { workspaceId } = await params;
  try {
    await requireWorkspacePermission(workspaceId, 'admin');

    const workspace = await prisma.workspace.findUnique({
      where: { id: workspaceId },
      select: {
        plan: true,
        planExpiresAt: true,
        stripeCustomerId: true,
        stripeSubscriptionId: true,
      },
    });

    if (!workspace) {
      return NextResponse.json({ error: 'Workspace nicht gefunden' }, { status: 404 });
    }

    let subscription: any = null;

    // Wenn eine Stripe-Subscription existiert, hole aktuelle Daten
    if (workspace.stripeSubscriptionId) {
      try {
        const stripeSub = await stripe.subscriptions.retrieve(workspace.stripeSubscriptionId);
        subscription = {
          id: stripeSub.id,
          status: stripeSub.status,
          cancelAtPeriodEnd: stripeSub.cancel_at_period_end,
          currentPeriodStart: new Date(stripeSub.current_period_start * 1000),
          currentPeriodEnd: new Date(stripeSub.current_period_end * 1000),
          cancelAt: stripeSub.cancel_at
            ? new Date(stripeSub.cancel_at * 1000)
            : null,
        };
      } catch {
        // Subscription existiert nicht mehr bei Stripe
        subscription = null;
      }
    }

    return NextResponse.json({
      plan: workspace.plan,
      planExpiresAt: workspace.planExpiresAt,
      hasStripeCustomer: !!workspace.stripeCustomerId,
      subscription,
    });
  } catch (error) {
    if (error instanceof Error && error.message.includes('Forbidden')) {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }
    console.error('Subscription fetch error:', error);
    return NextResponse.json(
      { error: 'Fehler beim Laden des Abonnements' },
      { status: 500 }
    );
  }
}
