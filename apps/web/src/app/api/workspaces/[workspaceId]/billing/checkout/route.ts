import { NextRequest, NextResponse } from 'next/server';
import { requireWorkspacePermission } from '@/lib/permissions';
import { createCheckoutSession } from '@/lib/stripe';
import { CreateCheckoutSchema } from '@builderly/sdk';

// POST /api/workspaces/[workspaceId]/billing/checkout
export async function POST(
  request: NextRequest,
  { params }: { params: { workspaceId: string } }
) {
  try {
    await requireWorkspacePermission(params.workspaceId, 'admin');

    const body = await request.json();
    const { plan, successUrl, cancelUrl } = CreateCheckoutSchema.parse(body);

    // Map plan to price ID
    const priceId = plan === 'PRO' 
      ? process.env.STRIPE_PRICE_PRO 
      : process.env.STRIPE_PRICE_BUSINESS;

    if (!priceId) {
      return NextResponse.json(
        { error: 'Stripe is not configured' },
        { status: 500 }
      );
    }

    const session = await createCheckoutSession(
      params.workspaceId,
      priceId,
      successUrl,
      cancelUrl
    );

    return NextResponse.json({ url: session.url });
  } catch (error) {
    if (error instanceof Error && error.message.includes('Forbidden')) {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }
    console.error('Checkout error:', error);
    return NextResponse.json({ error: 'Failed to create checkout session' }, { status: 500 });
  }
}
