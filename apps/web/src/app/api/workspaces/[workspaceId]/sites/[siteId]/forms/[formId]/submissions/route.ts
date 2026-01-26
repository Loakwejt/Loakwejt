import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@builderly/db';
import { requireWorkspacePermission } from '@/lib/permissions';
import { z } from 'zod';

// GET /api/workspaces/[workspaceId]/sites/[siteId]/forms/[formId]/submissions
export async function GET(
  request: NextRequest,
  { params }: { params: { workspaceId: string; siteId: string; formId: string } }
) {
  try {
    await requireWorkspacePermission(params.workspaceId, 'view');

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = Math.min(parseInt(searchParams.get('pageSize') || '50'), 100);
    const status = searchParams.get('status');
    const sortOrder = searchParams.get('order') === 'asc' ? 'asc' : 'desc';

    const where: Record<string, unknown> = { formId: params.formId };
    if (status) {
      where.status = status;
    }

    const [submissions, total] = await Promise.all([
      prisma.formSubmission.findMany({
        where,
        orderBy: { createdAt: sortOrder },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.formSubmission.count({ where }),
    ]);

    return NextResponse.json({
      data: submissions,
      meta: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    });
  } catch (error) {
    if (error instanceof Error && error.message.includes('Forbidden')) {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }
    console.error('Error fetching submissions:', error);
    return NextResponse.json({ error: 'Failed to fetch submissions' }, { status: 500 });
  }
}
