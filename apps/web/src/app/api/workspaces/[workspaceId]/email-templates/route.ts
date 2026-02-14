import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@builderly/db';
import { checkWorkspacePermission } from '@/lib/permissions';

interface RouteContext { params: Promise<{ workspaceId: string }> }

export async function GET(req: NextRequest, { params }: RouteContext) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { workspaceId } = await params;
  const hasAccess = await checkWorkspacePermission(workspaceId, session.user.id, 'view');
  if (!hasAccess) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const url = new URL(req.url);
  const page = Math.max(1, parseInt(url.searchParams.get('page') || '1'));
  const limit = Math.min(50, parseInt(url.searchParams.get('limit') || '20'));
  const type = url.searchParams.get('type') || '';

  const where: Record<string, unknown> = { workspaceId };
  if (type) where.type = type;

  const [templates, total] = await Promise.all([
    prisma.emailTemplate.findMany({ where, orderBy: { createdAt: 'desc' }, skip: (page - 1) * limit, take: limit }),
    prisma.emailTemplate.count({ where }),
  ]);
  return NextResponse.json({ templates, total, page, limit, pages: Math.ceil(total / limit) });
}

export async function POST(req: NextRequest, { params }: RouteContext) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { workspaceId } = await params;
  const hasAccess = await checkWorkspacePermission(workspaceId, session.user.id, 'edit');
  if (!hasAccess) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const body = await req.json();
  const { name, type, subject, htmlBody, textBody } = body;
  if (!name || !type || !subject || !htmlBody) {
    return NextResponse.json({ error: 'name, type, subject, and htmlBody are required' }, { status: 400 });
  }

  // Check uniqueness per site + type
  const existing = await prisma.emailTemplate.findFirst({ where: { workspaceId, type } });
  if (existing) return NextResponse.json({ error: `Template for type "${type}" already exists` }, { status: 409 });

  const template = await prisma.emailTemplate.create({
    data: {
      workspaceId, name, type, subject, bodyHtml: htmlBody,
      bodyText: textBody || null, isActive: true,
    },
  });
  return NextResponse.json(template, { status: 201 });
}
