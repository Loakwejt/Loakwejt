import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@builderly/db';
import { requireWorkspacePermission } from '@/lib/permissions';
import { createAuditLog } from '@/lib/audit';
import crypto from 'crypto';

// GET /api/workspaces/[workspaceId]/sites/[siteId]/domains
export async function GET(
  request: NextRequest,
  { params }: { params: { workspaceId: string; siteId: string } }
) {
  const perm = await requireWorkspacePermission(params.workspaceId, ['OWNER', 'ADMIN', 'EDITOR']);
  if ('error' in perm) return NextResponse.json({ error: perm.error }, { status: perm.status });

  const domains = await prisma.customDomain.findMany({
    where: { siteId: params.siteId },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json({ domains });
}

// POST /api/workspaces/[workspaceId]/sites/[siteId]/domains
export async function POST(
  request: NextRequest,
  { params }: { params: { workspaceId: string; siteId: string } }
) {
  const perm = await requireWorkspacePermission(params.workspaceId, ['OWNER', 'ADMIN']);
  if ('error' in perm) return NextResponse.json({ error: perm.error }, { status: perm.status });

  const body = await request.json();
  const { domain } = body;

  if (!domain || typeof domain !== 'string') {
    return NextResponse.json({ error: 'Domain ist erforderlich.' }, { status: 400 });
  }

  // Normalize domain
  const normalizedDomain = domain.toLowerCase().trim().replace(/^https?:\/\//, '').replace(/\/+$/, '');

  // Validate domain format
  const domainRegex = /^([a-z0-9]([a-z0-9-]*[a-z0-9])?\.)+[a-z]{2,}$/;
  if (!domainRegex.test(normalizedDomain)) {
    return NextResponse.json({ error: 'Ungültiges Domain-Format.' }, { status: 400 });
  }

  // Check if domain already exists
  const existing = await prisma.customDomain.findUnique({
    where: { domain: normalizedDomain },
  });
  if (existing) {
    return NextResponse.json({ error: 'Diese Domain wird bereits verwendet.' }, { status: 409 });
  }

  // Check plan limits
  const workspace = await prisma.workspace.findUnique({
    where: { id: params.workspaceId },
    select: { plan: true },
  });
  const planConfig = await prisma.planConfig.findUnique({
    where: { plan: workspace?.plan || 'FREE' },
  });
  const currentCount = await prisma.customDomain.count({
    where: { site: { workspaceId: params.workspaceId } },
  });
  if (planConfig && currentCount >= planConfig.maxCustomDomains) {
    return NextResponse.json(
      { error: `Dein Plan erlaubt maximal ${planConfig.maxCustomDomains} Custom Domains.` },
      { status: 403 }
    );
  }

  // Generate verification token
  const verificationToken = `builderly-verify-${crypto.randomBytes(16).toString('hex')}`;

  const customDomain = await prisma.customDomain.create({
    data: {
      siteId: params.siteId,
      domain: normalizedDomain,
      verificationToken,
      status: 'PENDING',
    },
  });

  // Also update the primary custom domain on the Site if it's the first one
  const domainCount = await prisma.customDomain.count({ where: { siteId: params.siteId } });
  if (domainCount === 1) {
    await prisma.$transaction([
      prisma.customDomain.update({ where: { id: customDomain.id }, data: { isPrimary: true } }),
      prisma.site.update({ where: { id: params.siteId }, data: { customDomain: normalizedDomain } }),
    ]);
  }

  await createAuditLog({
    action: 'CUSTOM_DOMAIN_ADDED',
    entity: 'CustomDomain',
    entityId: customDomain.id,
    userId: perm.userId,
    workspaceId: params.workspaceId,
    details: { domain: normalizedDomain, siteId: params.siteId },
  });

  return NextResponse.json({
    domain: customDomain,
    dnsInstructions: {
      type: 'CNAME',
      name: normalizedDomain,
      value: process.env.CNAME_TARGET || 'sites.builderly.app',
      txtRecord: {
        name: `_builderly.${normalizedDomain}`,
        value: verificationToken,
      },
    },
  });
}
