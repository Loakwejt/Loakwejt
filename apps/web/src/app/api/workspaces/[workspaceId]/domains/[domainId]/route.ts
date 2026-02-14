import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@builderly/db';
import { requireWorkspacePermission } from '@/lib/permissions';
import { createAuditLog } from '@/lib/audit';

// POST /api/workspaces/[workspaceId]/domains/[domainId]/verify
// Checks DNS records and verifies the domain
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ workspaceId: string; domainId: string }> }
) {
  const { workspaceId, domainId } = await params;
  const perm = await requireWorkspacePermission(workspaceId, 'admin').catch(() => null);
  if (!perm) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const domain = await prisma.customDomain.findFirst({
    where: { id: domainId, workspaceId },
  });

  if (!domain) {
    return NextResponse.json({ error: 'Domain nicht gefunden.' }, { status: 404 });
  }

  // In production, this would resolve DNS TXT records to check verification
  // For now, simulate verification by checking if the domain is configured
  let verified = false;
  let dnsConfigured = false;

  try {
    // Check DNS resolution (simplified — in production use dns.resolveTxt)
    const { promises: dns } = await import('dns');
    
    // Check CNAME/A record
    try {
      const addresses = await dns.resolve4(domain.domain);
      if (addresses.length > 0) dnsConfigured = true;
    } catch {
      try {
        const cnames = await dns.resolveCname(domain.domain);
        if (cnames.length > 0) dnsConfigured = true;
      } catch {
        // DNS not yet configured
      }
    }

    // Check TXT verification record
    try {
      const txtRecords = await dns.resolveTxt(`_builderly.${domain.domain}`);
      const flatRecords = txtRecords.map(r => r.join(''));
      if (flatRecords.includes(domain.verificationToken || '')) {
        verified = true;
      }
    } catch {
      // TXT record not found
    }
  } catch {
    // DNS module not available — skip check
  }

  const newStatus = verified ? 'VERIFIED' : dnsConfigured ? 'VERIFYING' : 'PENDING';

  await prisma.customDomain.update({
    where: { id: domain.id },
    data: {
      status: newStatus as any,
      dnsConfigured,
      verifiedAt: verified ? new Date() : undefined,
      lastCheckedAt: new Date(),
      sslStatus: verified ? 'PROVISIONING' : undefined,
    },
  });

  if (verified) {
    await createAuditLog({
      action: 'CUSTOM_DOMAIN_VERIFIED',
      entity: 'CustomDomain',
      entityId: domain.id,
      userId: perm.userId,
      details: { domain: domain.domain, workspaceId },
    });
  }

  return NextResponse.json({
    status: newStatus,
    dnsConfigured,
    verified,
    message: verified
      ? 'Domain erfolgreich verifiziert!'
      : dnsConfigured
      ? 'DNS konfiguriert, TXT-Verifizierung steht noch aus.'
      : 'DNS-Einträge noch nicht gefunden. Bitte warte bis zu 48 Stunden.',
  });
}

// DELETE /api/workspaces/[workspaceId]/domains/[domainId]
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ workspaceId: string; domainId: string }> }
) {
  const { workspaceId, domainId } = await params;
  const perm = await requireWorkspacePermission(workspaceId, 'admin').catch(() => null);
  if (!perm) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const domain = await prisma.customDomain.findFirst({
    where: { id: domainId, workspaceId },
  });

  if (!domain) {
    return NextResponse.json({ error: 'Domain nicht gefunden.' }, { status: 404 });
  }

  await prisma.customDomain.delete({ where: { id: domain.id } });

  // If this was the primary domain, clear it from the site
  if (domain.isPrimary) {
    await prisma.workspace.update({
      where: { id: workspaceId },
      data: { customDomain: null },
    });
  }

  await createAuditLog({
    action: 'CUSTOM_DOMAIN_REMOVED',
    entity: 'CustomDomain',
    entityId: domain.id,
    userId: perm.userId,
    details: { domain: domain.domain, workspaceId },
  });

  return NextResponse.json({ success: true });
}
