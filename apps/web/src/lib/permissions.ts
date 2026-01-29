import { prisma, Role } from '@builderly/db';
import { getServerSession } from 'next-auth';
import { authOptions } from './auth';

// Permission levels (higher = more permissions)
const ROLE_LEVELS: Record<Role, number> = {
  VIEWER: 1,
  EDITOR: 2,
  ADMIN: 3,
  OWNER: 4,
};

export type PermissionLevel = 'view' | 'edit' | 'admin' | 'owner';

const PERMISSION_REQUIRED_LEVEL: Record<PermissionLevel, number> = {
  view: 1,
  edit: 2,
  admin: 3,
  owner: 4,
};

export async function getCurrentUser() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return null;
  
  return prisma.user.findUnique({
    where: { id: session.user.id },
  });
}

export async function getWorkspaceMembership(workspaceId: string, userId: string) {
  return prisma.workspaceMember.findUnique({
    where: {
      workspaceId_userId: {
        workspaceId,
        userId,
      },
    },
  });
}

export async function checkWorkspacePermission(
  workspaceId: string,
  userId: string,
  requiredLevel: PermissionLevel
): Promise<boolean> {
  const membership = await getWorkspaceMembership(workspaceId, userId);
  if (!membership) return false;

  const userLevel = ROLE_LEVELS[membership.role as Role];
  const required = PERMISSION_REQUIRED_LEVEL[requiredLevel];

  return userLevel >= required;
}

export async function requireWorkspacePermission(
  workspaceId: string,
  requiredLevel: PermissionLevel
): Promise<{ userId: string; role: Role }> {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error('Unauthorized');
  }

  const membership = await getWorkspaceMembership(workspaceId, user.id);
  if (!membership) {
    throw new Error('Forbidden: Not a member of this workspace');
  }

  const userLevel = ROLE_LEVELS[membership.role as Role];
  const required = PERMISSION_REQUIRED_LEVEL[requiredLevel];

  if (userLevel < required) {
    throw new Error(`Forbidden: Requires ${requiredLevel} permission`);
  }

  return { userId: user.id, role: membership.role as Role };
}

export async function getUserWorkspaces(userId: string) {
  const memberships = await prisma.workspaceMember.findMany({
    where: { userId },
    include: {
      workspace: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return memberships.map((m: typeof memberships[number]) => ({
    ...m.workspace,
    role: m.role,
  }));
}

export async function canAccessSite(siteId: string, userId: string) {
  const site = await prisma.site.findUnique({
    where: { id: siteId },
    select: { workspaceId: true },
  });

  if (!site) return false;

  return checkWorkspacePermission(site.workspaceId, userId, 'view');
}

export async function canEditSite(siteId: string, userId: string) {
  const site = await prisma.site.findUnique({
    where: { id: siteId },
    select: { workspaceId: true },
  });

  if (!site) return false;

  return checkWorkspacePermission(site.workspaceId, userId, 'edit');
}
