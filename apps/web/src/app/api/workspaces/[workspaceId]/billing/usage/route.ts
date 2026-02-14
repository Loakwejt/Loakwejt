import { NextRequest, NextResponse } from 'next/server';
import { requireWorkspacePermission } from '@/lib/permissions';
import { prisma } from '@builderly/db';
import { getWorkspaceEntitlements } from '@/lib/entitlements';

// GET /api/workspaces/[workspaceId]/billing/usage
// Gibt die aktuelle Nutzung + Plan-Limits zurück
export async function GET(
  _request: NextRequest,
  { params }: { params: { workspaceId: string } }
) {
  try {
    await requireWorkspacePermission(params.workspaceId, 'viewer');

    const workspace = await prisma.workspace.findUnique({
      where: { id: params.workspaceId },
      select: { plan: true },
    });

    if (!workspace) {
      return NextResponse.json({ error: 'Workspace nicht gefunden' }, { status: 404 });
    }

    const entitlements = await getWorkspaceEntitlements(params.workspaceId);

    // Parallele Abfragen für die Usage-Werte
    const [siteCount, storageAgg, memberCount, pagesPerSite] = await Promise.all([
      prisma.site.count({ where: { workspaceId: params.workspaceId } }),
      prisma.asset.aggregate({
        where: { workspaceId: params.workspaceId },
        _sum: { size: true },
      }),
      prisma.workspaceMember.count({ where: { workspaceId: params.workspaceId } }),
      // Höchste Seitenanzahl über alle Sites
      prisma.site.findMany({
        where: { workspaceId: params.workspaceId },
        select: {
          id: true,
          _count: { select: { pages: true } },
        },
      }),
    ]);

    const maxPagesInAnySite = pagesPerSite.reduce(
      (max, s) => Math.max(max, s._count.pages),
      0
    );

    return NextResponse.json({
      plan: workspace.plan,
      limits: {
        plan: entitlements.plan,
        displayName: (entitlements as any).displayName || entitlements.plan,
        description: (entitlements as any).description || '',
        maxSites: entitlements.maxSites,
        maxPagesPerSite: entitlements.maxPagesPerSite,
        maxStorage: entitlements.maxStorage,
        maxCustomDomains: entitlements.maxCustomDomains,
        maxTeamMembers: entitlements.maxTeamMembers,
        maxFormSubmissionsPerMonth: entitlements.maxFormSubmissionsPerMonth,
        customDomains: entitlements.customDomains,
        removeWatermark: entitlements.removeWatermark,
        prioritySupport: entitlements.prioritySupport,
        dedicatedSupport: entitlements.dedicatedSupport,
        ecommerce: entitlements.ecommerce,
        passwordProtection: entitlements.passwordProtection,
        ssoSaml: entitlements.ssoSaml,
        whiteLabel: entitlements.whiteLabel,
        auditLog: entitlements.auditLog,
        slaGuarantee: entitlements.slaGuarantee,
        integrations: entitlements.integrations,
      },
      usage: {
        sites: siteCount,
        pagesMax: maxPagesInAnySite,
        storageUsed: Number(storageAgg._sum.size ?? 0),
        teamMembers: memberCount,
        customDomains: 0, // TODO: Wenn Custom-Domain-Modell existiert
      },
    });
  } catch (error) {
    if (error instanceof Error && error.message.includes('Forbidden')) {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }
    console.error('Usage fetch error:', error);
    return NextResponse.json({ error: 'Fehler beim Laden der Nutzung' }, { status: 500 });
  }
}
