import Stripe from 'stripe';
import { prisma, Plan } from '@builderly/db';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16',
});

export const STRIPE_PRICES: Record<string, Plan> = {
  [process.env.STRIPE_PRICE_PRO || 'price_pro']: 'PRO',
  [process.env.STRIPE_PRICE_BUSINESS || 'price_business']: 'BUSINESS',
  [process.env.STRIPE_PRICE_ENTERPRISE || 'price_enterprise']: 'ENTERPRISE',
};

export async function createCheckoutSession(
  workspaceId: string,
  priceId: string,
  successUrl: string,
  cancelUrl: string
): Promise<Stripe.Checkout.Session> {
  const workspace = await prisma.workspace.findUnique({
    where: { id: workspaceId },
    include: {
      members: {
        where: { role: 'OWNER' },
        include: { user: true },
        take: 1,
      },
    },
  });

  if (!workspace) {
    throw new Error('Workspace not found');
  }

  let customerId = workspace.stripeCustomerId;

  // Create customer if doesn't exist
  if (!customerId) {
    const owner = workspace.members[0]?.user;
    const customer = await stripe.customers.create({
      email: owner?.email || undefined,
      name: workspace.name,
      metadata: {
        workspaceId: workspace.id,
      },
    });
    
    customerId = customer.id;
    await prisma.workspace.update({
      where: { id: workspaceId },
      data: { stripeCustomerId: customerId },
    });
  }

  // Create checkout session
  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    payment_method_types: ['card'],
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    mode: 'subscription',
    success_url: successUrl,
    cancel_url: cancelUrl,
    metadata: {
      workspaceId,
    },
  });

  return session;
}

export async function createPortalSession(
  workspaceId: string,
  returnUrl: string
): Promise<Stripe.BillingPortal.Session> {
  const workspace = await prisma.workspace.findUnique({
    where: { id: workspaceId },
  });

  if (!workspace?.stripeCustomerId) {
    throw new Error('No billing account found');
  }

  return stripe.billingPortal.sessions.create({
    customer: workspace.stripeCustomerId,
    return_url: returnUrl,
  });
}

export async function handleSubscriptionUpdated(
  subscription: Stripe.Subscription
): Promise<void> {
  const workspaceId = subscription.metadata?.workspaceId;
  if (!workspaceId) {
    console.error('No workspaceId in subscription metadata');
    return;
  }

  // Determine plan from price
  const priceId = subscription.items.data[0]?.price?.id;
  const plan = priceId ? STRIPE_PRICES[priceId] : undefined;

  await prisma.workspace.update({
    where: { id: workspaceId },
    data: {
      stripeSubscriptionId: subscription.id,
      plan: plan || 'FREE',
      planExpiresAt: subscription.status === 'active' 
        ? new Date(subscription.current_period_end * 1000)
        : null,
    },
  });

  // Audit log (no userId – triggered by Stripe webhook)
  const { createAuditLog } = await import('@/lib/audit');
  await createAuditLog({ action: 'SUBSCRIPTION_UPDATED', entity: 'Workspace', entityId: workspaceId, details: { plan: plan || 'FREE', subscriptionId: subscription.id, status: subscription.status } });
}

export async function handleSubscriptionDeleted(
  subscription: Stripe.Subscription
): Promise<void> {
  const workspaceId = subscription.metadata?.workspaceId;
  if (!workspaceId) return;

  await prisma.workspace.update({
    where: { id: workspaceId },
    data: {
      plan: 'FREE',
      stripeSubscriptionId: null,
      planExpiresAt: null,
    },
  });

  // Audit log (no userId – triggered by Stripe webhook)
  const { createAuditLog } = await import('@/lib/audit');
  await createAuditLog({ action: 'SUBSCRIPTION_DELETED', entity: 'Workspace', entityId: workspaceId, details: { subscriptionId: subscription.id } });
}

export async function cancelSubscription(workspaceId: string): Promise<void> {
  const workspace = await prisma.workspace.findUnique({
    where: { id: workspaceId },
  });

  if (!workspace?.stripeSubscriptionId) {
    throw new Error('No active subscription');
  }

  await stripe.subscriptions.update(workspace.stripeSubscriptionId, {
    cancel_at_period_end: true,
  });
}
