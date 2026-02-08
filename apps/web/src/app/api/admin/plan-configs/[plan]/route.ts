import { NextRequest, NextResponse } from 'next/server';
import { prisma, Prisma } from '@builderly/db';
import { getCurrentUser } from '@/lib/permissions';
import { UpdatePlanConfigSchema } from '@builderly/sdk';
import { invalidatePlanConfigCache } from '@/lib/entitlements';
import { createAuditLog } from '@/lib/audit';

// ── Hilfs-Funktion: Prüft ob der User ein globaler Admin ist ──
async function requireAdmin() {
  const user = await getCurrentUser();
  if (!user) throw new Error('Unauthorized');

  const membership = await prisma.workspaceMember.findFirst({
    where: {
      userId: user.id,
      role: { in: ['OWNER', 'ADMIN'] },
    },
  });

  if (!membership) throw new Error('Forbidden: Admin-Rechte erforderlich');
  return user;
}

const VALID_PLANS = ['FREE', 'PRO', 'BUSINESS', 'ENTERPRISE'];

// GET /api/admin/plan-configs/[plan]
// Einzelne PlanConfig abrufen
export async function GET(
  _request: NextRequest,
  { params }: { params: { plan: string } }
) {
  try {
    await requireAdmin();

    const planKey = params.plan.toUpperCase();
    if (!VALID_PLANS.includes(planKey)) {
      return NextResponse.json({ error: 'Ungültiger Plan' }, { status: 400 });
    }

    const config = await (prisma as any).planConfig.findUnique({
      where: { plan: planKey },
    });

    if (!config) {
      return NextResponse.json(
        { error: `Konfiguration für Plan "${planKey}" nicht gefunden. Bitte führe zuerst das Seed-Script aus.` },
        { status: 404 }
      );
    }

    return NextResponse.json({
      ...config,
      maxStorage: Number(config.maxStorage),
    });
  } catch (error) {
    if (error instanceof Error && error.message.includes('Unauthorized')) {
      return NextResponse.json({ error: 'Nicht eingeloggt' }, { status: 401 });
    }
    if (error instanceof Error && error.message.includes('Forbidden')) {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }
    console.error('Plan config fetch error:', error);
    return NextResponse.json(
      { error: 'Fehler beim Laden der Plan-Konfiguration' },
      { status: 500 }
    );
  }
}

// PATCH /api/admin/plan-configs/[plan]
// Plan-Limits anpassen
export async function PATCH(
  request: NextRequest,
  { params }: { params: { plan: string } }
) {
  try {
    const user = await requireAdmin();

    const planKey = params.plan.toUpperCase();
    if (!VALID_PLANS.includes(planKey)) {
      return NextResponse.json({ error: 'Ungültiger Plan' }, { status: 400 });
    }

    const body = await request.json();
    const validated = UpdatePlanConfigSchema.parse(body);

    // Existenz prüfen
    const existing = await (prisma as any).planConfig.findUnique({
      where: { plan: planKey },
    });

    if (!existing) {
      return NextResponse.json(
        { error: `Konfiguration für Plan "${planKey}" nicht gefunden.` },
        { status: 404 }
      );
    }

    // Update-Daten vorbereiten
    const updateData: any = {};

    if (validated.displayName !== undefined) updateData.displayName = validated.displayName;
    if (validated.description !== undefined) updateData.description = validated.description;
    if (validated.maxSites !== undefined) updateData.maxSites = validated.maxSites;
    if (validated.maxPagesPerSite !== undefined) updateData.maxPagesPerSite = validated.maxPagesPerSite;
    if (validated.maxStorage !== undefined) updateData.maxStorage = BigInt(validated.maxStorage);
    if (validated.maxCustomDomains !== undefined) updateData.maxCustomDomains = validated.maxCustomDomains;
    if (validated.maxTeamMembers !== undefined) updateData.maxTeamMembers = validated.maxTeamMembers;
    if (validated.maxFormSubmissionsPerMonth !== undefined)
      updateData.maxFormSubmissionsPerMonth = validated.maxFormSubmissionsPerMonth;

    // Feature flags
    for (const flag of [
      'customDomains', 'removeWatermark', 'prioritySupport', 'dedicatedSupport',
      'ecommerce', 'passwordProtection', 'ssoSaml', 'whiteLabel', 'auditLog', 'slaGuarantee',
    ] as const) {
      if ((validated as any)[flag] !== undefined) {
        updateData[flag] = (validated as any)[flag];
      }
    }

    // Integrations
    if (validated.integrations !== undefined) {
      updateData.integrations = validated.integrations as Prisma.InputJsonValue;
    }

    const updated = await (prisma as any).planConfig.update({
      where: { plan: planKey },
      data: updateData,
    });

    // ── Cache invalidieren, damit alle Worker sofort die neuen Werte nutzen ──
    invalidatePlanConfigCache();

    await createAuditLog({ userId: user.id, action: 'PLAN_CONFIG_UPDATED', entity: 'PlanConfig', entityId: planKey, details: { changes: Object.keys(updateData) } });

    return NextResponse.json({
      ...updated,
      maxStorage: Number(updated.maxStorage),
    });
  } catch (error) {
    if (error instanceof Error && error.message.includes('Unauthorized')) {
      return NextResponse.json({ error: 'Nicht eingeloggt' }, { status: 401 });
    }
    if (error instanceof Error && error.message.includes('Forbidden')) {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }
    console.error('Plan config update error:', error);
    return NextResponse.json(
      { error: 'Fehler beim Aktualisieren der Plan-Konfiguration' },
      { status: 500 }
    );
  }
}
