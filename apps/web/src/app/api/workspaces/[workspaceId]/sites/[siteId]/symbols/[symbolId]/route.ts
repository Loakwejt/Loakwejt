import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@builderly/db';
import { requireWorkspacePermission } from '@/lib/permissions';
import { z } from 'zod';

// Schema for updating a symbol
const UpdateSymbolSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  category: z.string().optional(),
  tree: z.any().optional(), // BuilderNode JSON
  thumbnailUrl: z.string().optional(),
});

// GET /api/workspaces/[workspaceId]/sites/[siteId]/symbols/[symbolId]
export async function GET(
  request: NextRequest,
  { params }: { params: { workspaceId: string; siteId: string; symbolId: string } }
) {
  try {
    await requireWorkspacePermission(params.workspaceId, 'view');

    const symbol = await prisma.symbol.findUnique({
      where: { id: params.symbolId },
    });

    if (!symbol) {
      return NextResponse.json({ error: 'Symbol not found' }, { status: 404 });
    }

    // Verify symbol belongs to this site
    if (symbol.siteId !== params.siteId) {
      return NextResponse.json({ error: 'Symbol not found' }, { status: 404 });
    }

    return NextResponse.json({ data: symbol });
  } catch (error) {
    if (error instanceof Error && error.message.includes('Forbidden')) {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }
    console.error('Error fetching symbol:', error);
    return NextResponse.json({ error: 'Failed to fetch symbol' }, { status: 500 });
  }
}

// PATCH /api/workspaces/[workspaceId]/sites/[siteId]/symbols/[symbolId]
export async function PATCH(
  request: NextRequest,
  { params }: { params: { workspaceId: string; siteId: string; symbolId: string } }
) {
  try {
    await requireWorkspacePermission(params.workspaceId, 'edit');

    const body = await request.json();
    const validated = UpdateSymbolSchema.parse(body);

    // Verify symbol exists and belongs to this site
    const existing = await prisma.symbol.findUnique({
      where: { id: params.symbolId },
    });

    if (!existing || existing.siteId !== params.siteId) {
      return NextResponse.json({ error: 'Symbol not found' }, { status: 404 });
    }

    // If changing name, check for conflicts
    if (validated.name && validated.name !== existing.name) {
      const nameConflict = await prisma.symbol.findUnique({
        where: {
          siteId_name: {
            siteId: params.siteId,
            name: validated.name,
          },
        },
      });

      if (nameConflict) {
        return NextResponse.json(
          { error: 'Ein Symbol mit diesem Namen existiert bereits' },
          { status: 400 }
        );
      }
    }

    const symbol = await prisma.symbol.update({
      where: { id: params.symbolId },
      data: validated,
    });

    return NextResponse.json({ data: symbol });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    if (error instanceof Error && error.message.includes('Forbidden')) {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }
    console.error('Error updating symbol:', error);
    return NextResponse.json({ error: 'Failed to update symbol' }, { status: 500 });
  }
}

// DELETE /api/workspaces/[workspaceId]/sites/[siteId]/symbols/[symbolId]
export async function DELETE(
  request: NextRequest,
  { params }: { params: { workspaceId: string; siteId: string; symbolId: string } }
) {
  try {
    await requireWorkspacePermission(params.workspaceId, 'edit');

    // Verify symbol exists and belongs to this site
    const existing = await prisma.symbol.findUnique({
      where: { id: params.symbolId },
    });

    if (!existing || existing.siteId !== params.siteId) {
      return NextResponse.json({ error: 'Symbol not found' }, { status: 404 });
    }

    await prisma.symbol.delete({
      where: { id: params.symbolId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof Error && error.message.includes('Forbidden')) {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }
    console.error('Error deleting symbol:', error);
    return NextResponse.json({ error: 'Failed to delete symbol' }, { status: 500 });
  }
}
