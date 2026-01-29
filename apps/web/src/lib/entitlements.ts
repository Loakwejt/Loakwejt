import { prisma, Plan } from '@builderly/db';
import { PLAN_ENTITLEMENTS, type Entitlements } from '@builderly/sdk';

export async function getWorkspaceEntitlements(workspaceId: string): Promise<Entitlements> {
  const workspace = await prisma.workspace.findUnique({
    where: { id: workspaceId },
    select: { plan: true },
  });

  if (!workspace) {
    throw new Error('Workspace not found');
  }

  // workspace.plan is always a valid Plan enum value, so the lookup is guaranteed to succeed
  return (PLAN_ENTITLEMENTS[workspace.plan] ?? PLAN_ENTITLEMENTS.FREE) as Entitlements;
}

export async function checkEntitlement(
  workspaceId: string,
  check: (entitlements: Entitlements) => boolean
): Promise<boolean> {
  const entitlements = await getWorkspaceEntitlements(workspaceId);
  return check(entitlements);
}

export async function canCreateSite(workspaceId: string): Promise<{ allowed: boolean; reason?: string }> {
  const entitlements = await getWorkspaceEntitlements(workspaceId);
  
  const siteCount = await prisma.site.count({
    where: { workspaceId },
  });

  if (siteCount >= entitlements.maxSites) {
    return {
      allowed: false,
      reason: `You have reached the maximum number of sites (${entitlements.maxSites}) for your plan. Please upgrade to create more sites.`,
    };
  }

  return { allowed: true };
}

export async function canCreatePage(siteId: string): Promise<{ allowed: boolean; reason?: string }> {
  const site = await prisma.site.findUnique({
    where: { id: siteId },
    select: { workspaceId: true },
  });

  if (!site) {
    return { allowed: false, reason: 'Site not found' };
  }

  const entitlements = await getWorkspaceEntitlements(site.workspaceId);
  
  const pageCount = await prisma.page.count({
    where: { siteId },
  });

  if (pageCount >= entitlements.maxPagesPerSite) {
    return {
      allowed: false,
      reason: `You have reached the maximum number of pages (${entitlements.maxPagesPerSite}) for this site. Please upgrade to create more pages.`,
    };
  }

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
      reason: `Storage limit exceeded. You are using ${currentUsageMB}MB of ${maxStorageMB}MB. Please upgrade for more storage.`,
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
