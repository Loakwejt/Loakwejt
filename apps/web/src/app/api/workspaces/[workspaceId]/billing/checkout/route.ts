import { NextRequest, NextResponse } from 'next/server';
import { requireWorkspacePermission } from '@/lib/permissions';
import { createCheckoutSession } from '@/lib/stripe';
import { CreateCheckoutSchema } from '@builderly/sdk';
import { createAuditLog } from '@/lib/audit';

// POST /api/workspaces/[workspaceId]/billing/checkout
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ workspaceId: string }> }
) {
  const { workspaceId } = await params;
  try {
    const { userId } = await requireWorkspacePermission(workspaceId, 'admin');

    const body = await request.json();
    const { plan, successUrl, cancelUrl } = CreateCheckoutSchema.parse(body);

    // Map plan to price ID
    const priceIdMap: Record<string, string | undefined> = {
      PRO: process.env.STRIPE_PRICE_PRO,
      BUSINESS: process.env.STRIPE_PRICE_BUSINESS,
      ENTERPRISE: process.env.STRIPE_PRICE_ENTERPRISE,
    };
    const priceId = priceIdMap[plan];

    if (!priceId) {
      return NextResponse.json(
        { error: 'Stripe is not configured' },
        { status: 500 }
      );
    }

    const session = await createCheckoutSession(
      workspaceId,
      priceId,
      successUrl,
      cancelUrl
    );

    await createAuditLog({
      userId,
      action: 'BILLING_CHECKOUT_STARTED',
      entity: 'Workspace',
      entityId: workspaceId,
      details: { plan },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    if (error instanceof Error && error.message.includes('Forbidden')) {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }
    console.error('Checkout error:', error);
    return NextResponse.json({ error: 'Failed to create checkout session' }, { status: 500 });
  }
}
