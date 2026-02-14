import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@builderly/db';
import { checkWorkspacePermission } from '@/lib/permissions';

interface RouteContext {
  params: Promise<{ workspaceId: string }>;
}

// GET analytics stats for a site
export async function GET(req: NextRequest, { params }: RouteContext) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { workspaceId } = await params;
  const hasAccess = await checkWorkspacePermission(workspaceId, session.user.id, 'view');
  if (!hasAccess) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const url = new URL(req.url);
  const days = parseInt(url.searchParams.get('days') || '30');
  const since = new Date();
  since.setDate(since.getDate() - days);

  const [totalViews, viewsByDay, topPages, devices, browsers, referrers] = await Promise.all([
    // Total views
    prisma.pageView.count({
      where: { workspaceId, createdAt: { gte: since } },
    }),

    // Views by day
    prisma.$queryRawUnsafe<Array<{ date: string; count: bigint }>>(
      `SELECT DATE("createdAt") as date, COUNT(*) as count FROM "PageView" WHERE "workspaceId" = $1 AND "createdAt" >= $2 GROUP BY DATE("createdAt") ORDER BY date ASC`,
      workspaceId,
      since
    ),

    // Top pages
    prisma.pageView.groupBy({
      by: ['path'],
      where: { workspaceId, createdAt: { gte: since } },
      _count: { path: true },
      orderBy: { _count: { path: 'desc' } },
      take: 10,
    }),

    // Device breakdown
    prisma.pageView.groupBy({
      by: ['device'],
      where: { workspaceId, createdAt: { gte: since } },
      _count: { device: true },
    }),

    // Browser breakdown
    prisma.pageView.groupBy({
      by: ['browser'],
      where: { workspaceId, createdAt: { gte: since } },
      _count: { browser: true },
    }),

    // Top referrers
    prisma.pageView.groupBy({
      by: ['referrer'],
      where: {
        workspaceId,
        createdAt: { gte: since },
        referrer: { not: null },
      },
      _count: { referrer: true },
      orderBy: { _count: { referrer: 'desc' } },
      take: 10,
    }),
  ]);

  return NextResponse.json({
    totalViews,
    viewsByDay: viewsByDay.map(d => ({
      date: String(d.date),
      count: Number(d.count),
    })),
    topPages: topPages.map(p => ({
      path: p.path,
      count: p._count.path,
    })),
    devices: devices.map(d => ({
      device: d.device || 'Unbekannt',
      count: d._count.device,
    })),
    browsers: browsers.map(b => ({
      browser: b.browser || 'Unbekannt',
      count: b._count.browser,
    })),
    referrers: referrers.map(r => ({
      referrer: r.referrer || 'Direkt',
      count: r._count.referrer,
    })),
    days,
  });
}
