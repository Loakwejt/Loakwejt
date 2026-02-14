import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@builderly/db';

interface RouteContext {
  params: Promise<{ workspaceId: string }>;
}

// GET /api/workspaces/[workspaceId]/users/stats
// Statistiken über die Site-Benutzer
export async function GET(
  _request: NextRequest,
  { params }: RouteContext
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Nicht autorisiert.' }, { status: 401 });
    }

    const { workspaceId } = await params;

    // Parallel queries for stats
    const [
      totalUsers,
      activeUsers,
      bannedUsers,
      newUsersToday,
      newUsersThisWeek,
      newUsersThisMonth,
      roleDistribution,
      providerDistribution,
      recentSignups,
      activeSessionCount,
    ] = await Promise.all([
      prisma.siteUser.count({ where: { workspaceId } }),
      prisma.siteUser.count({ where: { workspaceId, isActive: true, isBanned: false } }),
      prisma.siteUser.count({ where: { workspaceId, isBanned: true } }),
      prisma.siteUser.count({
        where: {
          workspaceId,
          createdAt: { gte: new Date(new Date().setHours(0, 0, 0, 0)) },
        },
      }),
      prisma.siteUser.count({
        where: {
          workspaceId,
          createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
        },
      }),
      prisma.siteUser.count({
        where: {
          workspaceId,
          createdAt: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
        },
      }),
      prisma.siteUser.groupBy({
        by: ['role'],
        where: { workspaceId },
        _count: { role: true },
      }),
      prisma.siteUser.groupBy({
        by: ['provider'],
        where: { workspaceId },
        _count: { provider: true },
      }),
      prisma.siteUser.findMany({
        where: { workspaceId },
        orderBy: { createdAt: 'desc' },
        take: 5,
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          createdAt: true,
        },
      }),
      prisma.siteUserSession.count({
        where: {
          siteUser: { workspaceId },
          expiresAt: { gt: new Date() },
        },
      }),
    ]);

    return NextResponse.json({
      totalUsers,
      activeUsers,
      bannedUsers,
      inactiveUsers: totalUsers - activeUsers - bannedUsers,
      newUsersToday,
      newUsersThisWeek,
      newUsersThisMonth,
      activeSessions: activeSessionCount,
      roleDistribution: roleDistribution.map((r) => ({
        role: r.role,
        count: r._count.role,
      })),
      providerDistribution: providerDistribution.map((p) => ({
        provider: p.provider || 'email',
        count: p._count.provider,
      })),
      recentSignups,
    });
  } catch (error) {
    console.error('Error fetching site user stats:', error);
    return NextResponse.json({ error: 'Fehler beim Laden der Statistiken.' }, { status: 500 });
  }
}
