import { NextRequest, NextResponse } from 'next/server';
import { requireWorkspacePermission } from '@/lib/permissions';
import { prisma } from '@builderly/db';
import { getWorkspaceEntitlements } from '@/lib/entitlements';

interface RouteContext {
  params: Promise<{ workspaceId: string }>;
}

// GET /api/workspaces/[workspaceId]/billing/usage
// Gibt die aktuelle Nutzung + Plan-Limits zurück
export async function GET(
  _request: NextRequest,
  { params }: RouteContext
) {
  try {
    const { workspaceId } = await params;
    await requireWorkspacePermission(workspaceId, 'view');

    const workspace = await prisma.workspace.findUnique({
      where: { id: workspaceId },
      select: { plan: true },
    });

    if (!workspace) {
      return NextResponse.json({ error: 'Workspace nicht gefunden' }, { status: 404 });
    }

    const entitlements = await getWorkspaceEntitlements(workspaceId);

    // Parallele Abfragen für die Usage-Werte
    const [pageCount, storageAgg, memberCount] = await Promise.all([
      prisma.page.count({ where: { workspaceId } }),
      prisma.asset.aggregate({
        where: { workspaceId },
        _sum: { size: true },
      }),
      prisma.workspaceMember.count({ where: { workspaceId } }),
    ]);

    return NextResponse.json({
      plan: workspace.plan,
      limits: {
        plan: entitlements.plan,
        displayName: (entitlements as any).displayName || entitlements.plan,
        description: (entitlements as any).description || '',
        maxPages: entitlements.maxPages,
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
        pages: pageCount,
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
