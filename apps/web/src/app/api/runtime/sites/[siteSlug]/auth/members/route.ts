import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@builderly/db';

// GET /api/runtime/sites/[siteSlug]/auth/members
// Gibt die öffentliche Mitgliederliste einer Site zurück
export async function GET(
  request: NextRequest,
  { params }: { params: { siteSlug: string } }
) {
  try {
    const site = await prisma.site.findFirst({
      where: { slug: params.siteSlug, isPublished: true },
      select: { id: true, settings: true },
    });

    if (!site) {
      return NextResponse.json({ error: 'Website nicht gefunden.' }, { status: 404 });
    }

    // Parse query params
    const url = new URL(request.url);
    const page = Math.max(1, parseInt(url.searchParams.get('page') || '1'));
    const pageSize = Math.min(50, Math.max(1, parseInt(url.searchParams.get('pageSize') || '20')));
    const search = url.searchParams.get('search') || '';
    const role = url.searchParams.get('role') || '';

    // Build where clause
    const where: Record<string, unknown> = {
      siteId: site.id,
      isActive: true,
      isBanned: false,
    };

    if (role) {
      where.role = role;
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [members, total] = await Promise.all([
      prisma.siteUser.findMany({
        where: where as any,
        select: {
          id: true,
          name: true,
          avatar: true,
          bio: true,
          role: true,
          createdAt: true,
          // Don't expose email publicly — privacy
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.siteUser.count({ where: where as any }),
    ]);

    return NextResponse.json({
      members,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    });
  } catch (error) {
    console.error('Members list error:', error);
    return NextResponse.json(
      { error: 'Mitgliederliste konnte nicht geladen werden.' },
      { status: 500 }
    );
  }
}
