import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@builderly/db';
import { checkWorkspacePermission } from '@/lib/permissions';

interface RouteContext { params: Promise<{ workspaceId: string }> }

export async function GET(_req: NextRequest, { params }: RouteContext) {
  const { workspaceId } = await params;
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const hasAccess = await checkWorkspacePermission(workspaceId, session.user.id, 'view');
  if (!hasAccess) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  let settings = await prisma.invoiceSettings.findUnique({ where: { workspaceId } });
  if (!settings) {
    settings = await prisma.invoiceSettings.create({
      data: { workspaceId, invoicePrefix: 'INV', nextInvoiceNumber: 1, defaultTaxRate: 19, defaultPaymentTermsDays: 14 },
    });
  }
  return NextResponse.json(settings);
}

export async function PUT(req: NextRequest, { params }: RouteContext) {
  const { workspaceId } = await params;
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const hasAccess = await checkWorkspacePermission(workspaceId, session.user.id, 'admin');
  if (!hasAccess) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const body = await req.json();
  const settings = await prisma.invoiceSettings.upsert({
    where: { workspaceId },
    create: { workspaceId, ...body },
    update: body,
  });
  return NextResponse.json(settings);
}
