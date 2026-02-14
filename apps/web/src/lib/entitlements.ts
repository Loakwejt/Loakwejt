import { prisma, Plan } from '@builderly/db';
import { PLAN_ENTITLEMENTS, PLAN_INTEGRATIONS, type Entitlements, type IntegrationId } from '@builderly/sdk';

// ============================================================================
// IN-MEMORY CACHE for PlanConfig rows (TTL-based, auto-refreshed)
// ============================================================================

interface CachedEntitlements {
  data: Record<string, Entitlements>;
  fetchedAt: number;
}

const CACHE_TTL_MS = 60_000; // 1 minute
let _cache: CachedEntitlements | null = null;

/**
 * Loads all PlanConfig rows from the DB and maps them to the Entitlements shape.
 * Falls back to the hardcoded PLAN_ENTITLEMENTS if PlanConfig table is empty
 * (e.g. before seed has run).
 */
async function loadPlanConfigs(): Promise<Record<string, Entitlements>> {
  try {
    const rows = await prisma.planConfig.findMany();

    if (rows.length === 0) {
      // Fallback: Tabelle noch nicht geseeded → hardcoded Werte nutzen
      return { ...PLAN_ENTITLEMENTS };
    }

    const map: Record<string, Entitlements> = {};
    for (const row of rows) {
      const integrations: string[] = Array.isArray(row.integrations)
        ? (row.integrations as string[])
        : [];

      map[row.plan] = {
        plan: row.plan,
        maxPages: row.maxPages,
        maxStorage: Number(row.maxStorage),
        maxCustomDomains: row.maxCustomDomains,
        maxTeamMembers: row.maxTeamMembers,
        maxFormSubmissionsPerMonth: row.maxFormSubmissionsPerMonth,
        customDomains: row.customDomains,
        removeWatermark: row.removeWatermark,
        prioritySupport: row.prioritySupport,
        dedicatedSupport: row.dedicatedSupport,
        ecommerce: row.ecommerce,
        passwordProtection: row.passwordProtection,
        ssoSaml: row.ssoSaml,
        whiteLabel: row.whiteLabel,
        auditLog: row.auditLog,
        slaGuarantee: row.slaGuarantee,
        integrations: integrations as IntegrationId[],
      };
    }

    return map;
  } catch {
    // Falls die Tabelle noch nicht existiert (z.B. Migration noch nicht gelaufen)
    return { ...PLAN_ENTITLEMENTS };
  }
}

async function getCachedPlanConfigs(): Promise<Record<string, Entitlements>> {
  const now = Date.now();
  if (_cache && now - _cache.fetchedAt < CACHE_TTL_MS) {
    return _cache.data;
  }
  const data = await loadPlanConfigs();
  _cache = { data, fetchedAt: now };
  return data;
}

/** Invalidate the in-memory cache (call after admin updates a PlanConfig). */
export function invalidatePlanConfigCache(): void {
  _cache = null;
}

// ============================================================================
// CORE: getWorkspaceEntitlements
// ============================================================================

export async function getWorkspaceEntitlements(workspaceId: string): Promise<Entitlements> {
  const workspace = await prisma.workspace.findUnique({
    where: { id: workspaceId },
    select: { plan: true },
  });

  if (!workspace) {
    throw new Error('Workspace not found');
  }

  const configs = await getCachedPlanConfigs();
  const result = configs[workspace.plan] ?? configs.FREE ?? PLAN_ENTITLEMENTS.FREE;
  if (!result) throw new Error(`No plan configuration found for plan: ${workspace.plan}`);
  return result;
}

export async function checkEntitlement(
  workspaceId: string,
  check: (entitlements: Entitlements) => boolean
): Promise<boolean> {
  const entitlements = await getWorkspaceEntitlements(workspaceId);
  return check(entitlements);
}

// canCreateSite removed – workspaces are created separately, not "sites"

// Seitenanzahl-Beschränkung entfernt - unbegrenzte Seiten erlaubt
export async function canCreatePage(_workspaceId: string): Promise<{ allowed: boolean; reason?: string }> {
  return { allowed: true };
}

export async function canUploadAsset(
  workspaceId: string,
  fileSizeBytes: number
): Promise<{ allowed: boolean; reason?: string }> {
  const entitlements = await getWorkspaceEntitlements(workspaceId);
  
  const totalStorage = await prisma.asset.aggregate({
    where: { workspaceId },
    _sum: { size: true },
  });

  const currentUsage = totalStorage._sum.size || 0;
  const newTotal = currentUsage + fileSizeBytes;

  if (newTotal > entitlements.maxStorage) {
    const maxStorageMB = Math.round(entitlements.maxStorage / (1024 * 1024));
    const currentUsageMB = Math.round(currentUsage / (1024 * 1024));
    return {
      allowed: false,
      reason: `Speicherlimit überschritten. Du nutzt ${currentUsageMB} MB von ${maxStorageMB} MB. Bitte upgrade für mehr Speicher.`,
    };
  }

  return { allowed: true };
}

export async function shouldShowWatermark(workspaceId: string): Promise<boolean> {
  const entitlements = await getWorkspaceEntitlements(workspaceId);
  return !entitlements.removeWatermark;
}

export async function canUseCustomDomain(workspaceId: string): Promise<boolean> {
  const entitlements = await getWorkspaceEntitlements(workspaceId);
  return entitlements.customDomains;
}

export async function canAddTeamMember(workspaceId: string): Promise<{ allowed: boolean; reason?: string }> {
  const entitlements = await getWorkspaceEntitlements(workspaceId);
  
  const memberCount = await prisma.workspaceMember.count({
    where: { workspaceId },
  });

  if (memberCount >= entitlements.maxTeamMembers) {
    return {
      allowed: false,
      reason: `Du hast die maximale Anzahl an Team-Mitgliedern (${entitlements.maxTeamMembers}) für deinen Plan erreicht. Bitte upgrade für mehr Mitglieder.`,
    };
  }

  return { allowed: true };
}

export async function canUseIntegration(
  workspaceId: string,
  integrationId: string
): Promise<{ allowed: boolean; reason?: string }> {
  const entitlements = await getWorkspaceEntitlements(workspaceId);
  
  const allowedIntegrations = entitlements.integrations ?? [];
  
  if (!allowedIntegrations.includes(integrationId as any)) {
    return {
      allowed: false,
      reason: `Die Integration "${integrationId}" ist in deinem aktuellen Plan nicht verfügbar. Bitte upgrade um diese Funktion zu nutzen.`,
    };
  }

  return { allowed: true };
}

export async function canUseEcommerce(workspaceId: string): Promise<boolean> {
  const entitlements = await getWorkspaceEntitlements(workspaceId);
  return entitlements.ecommerce;
}

export async function canUsePasswordProtection(workspaceId: string): Promise<boolean> {
  const entitlements = await getWorkspaceEntitlements(workspaceId);
  return entitlements.passwordProtection;
}

export async function canUseSso(workspaceId: string): Promise<boolean> {
  const entitlements = await getWorkspaceEntitlements(workspaceId);
  return entitlements.ssoSaml;
}

export async function canUseWhiteLabel(workspaceId: string): Promise<boolean> {
  const entitlements = await getWorkspaceEntitlements(workspaceId);
  return entitlements.whiteLabel;
}

export async function canUseAuditLog(workspaceId: string): Promise<boolean> {
  const entitlements = await getWorkspaceEntitlements(workspaceId);
  return entitlements.auditLog;
}
