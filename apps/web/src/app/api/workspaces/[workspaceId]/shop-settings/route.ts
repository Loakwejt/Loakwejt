import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@builderly/db';
import { checkWorkspacePermission } from '@/lib/permissions';

interface RouteContext {
  params: Promise<{ workspaceId: string }>;
}

// GET /api/workspaces/:wid/shop-settings
export async function GET(req: NextRequest, { params }: RouteContext) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { workspaceId } = await params;
  const hasAccess = await checkWorkspacePermission(workspaceId, session.user.id, 'view');
  if (!hasAccess) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  let settings = await prisma.shopSettings.findUnique({
    where: { workspaceId },
  });

  // Create default settings if none exist
  if (!settings) {
    settings = await prisma.shopSettings.create({
      data: { workspaceId },
    });
  }

  return NextResponse.json({ settings });
}

// PUT /api/workspaces/:wid/shop-settings
export async function PUT(req: NextRequest, { params }: RouteContext) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { workspaceId } = await params;
  const hasAccess = await checkWorkspacePermission(workspaceId, session.user.id, 'admin');
  if (!hasAccess) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const body = await req.json();
  const {
    currency, taxRate, taxIncluded,
    requireAccount, enableGuestCheckout,
    orderNotifyEmail,
    termsUrl, privacyUrl, returnPolicyUrl, imprintUrl,
    shopName, shopLogo,
  } = body;

  const settings = await prisma.shopSettings.upsert({
    where: { workspaceId },
    create: {
      workspaceId,
      currency: currency ?? 'EUR',
      taxRate: taxRate ?? 19.0,
      taxIncluded: taxIncluded !== false,
      requireAccount: requireAccount === true,
      enableGuestCheckout: enableGuestCheckout !== false,
      orderNotifyEmail: orderNotifyEmail || null,
      termsUrl: termsUrl || null,
      privacyUrl: privacyUrl || null,
      returnPolicyUrl: returnPolicyUrl || null,
      imprintUrl: imprintUrl || null,
      shopName: shopName || null,
      shopLogo: shopLogo || null,
    },
    update: {
      ...(currency !== undefined && { currency }),
      ...(taxRate !== undefined && { taxRate }),
      ...(taxIncluded !== undefined && { taxIncluded }),
      ...(requireAccount !== undefined && { requireAccount }),
      ...(enableGuestCheckout !== undefined && { enableGuestCheckout }),
      ...(orderNotifyEmail !== undefined && { orderNotifyEmail }),
      ...(termsUrl !== undefined && { termsUrl }),
      ...(privacyUrl !== undefined && { privacyUrl }),
      ...(returnPolicyUrl !== undefined && { returnPolicyUrl }),
      ...(imprintUrl !== undefined && { imprintUrl }),
      ...(shopName !== undefined && { shopName }),
      ...(shopLogo !== undefined && { shopLogo }),
    },
  });

  return NextResponse.json({ settings });
}
