import { NextRequest, NextResponse } from 'next/server';
import { prisma, Prisma } from '@builderly/db';
import { requireWorkspacePermission } from '@/lib/permissions';
import { createAuditLog } from '@/lib/audit';
import { invalidateSymbolUsages } from '@/lib/reference-validator';
import { z } from 'zod';

// Schema for updating a symbol
const UpdateSymbolSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  category: z.string().optional(),
  tree: z.any().optional(), // BuilderNode JSON
  thumbnailUrl: z.string().optional(),
});

interface RouteContext {
  params: Promise<{ workspaceId: string; symbolId: string }>;
}

// GET /api/workspaces/[workspaceId]/symbols/[symbolId]
export async function GET(
  request: NextRequest,
  { params }: RouteContext
) {
  try {
    const { workspaceId, symbolId } = await params;
    await requireWorkspacePermission(workspaceId, 'view');

    const symbol = await prisma.symbol.findUnique({
      where: { id: symbolId },
    });

    if (!symbol) {
      return NextResponse.json({ error: 'Symbol not found' }, { status: 404 });
    }

    // Verify symbol belongs to this site
    if (symbol.workspaceId !== workspaceId) {
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

// PATCH /api/workspaces/[workspaceId]/symbols/[symbolId]
export async function PATCH(
  request: NextRequest,
  { params }: RouteContext
) {
  try {
    const { workspaceId, symbolId } = await params;
    const { userId } = await requireWorkspacePermission(workspaceId, 'edit');

    const body = await request.json();
    const validated = UpdateSymbolSchema.parse(body);

    // Verify symbol exists and belongs to this site
    const existing = await prisma.symbol.findUnique({
      where: { id: symbolId },
    });

    if (!existing || existing.workspaceId !== workspaceId) {
      return NextResponse.json({ error: 'Symbol not found' }, { status: 404 });
    }

    // If changing name, check for conflicts
    if (validated.name && validated.name !== existing.name) {
      const nameConflict = await prisma.symbol.findUnique({
        where: {
          workspaceId_name: {
            workspaceId,
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

    // Destructure tree to handle separately
    const { tree, ...restValidated } = validated;

    const symbol = await prisma.symbol.update({
      where: { id: symbolId },
      data: {
        ...restValidated,
        ...(tree !== undefined && { tree: tree as Prisma.InputJsonValue }),
      },
    });

    // Wenn der Symbol-Tree geändert wurde, alle Seiten die dieses Symbol nutzen für Re-Publish markieren
    let affectedPagesCount = 0;
    if (tree !== undefined) {
      const affectedPages = await invalidateSymbolUsages(symbolId, workspaceId);
      affectedPagesCount = affectedPages.length;
    }

    await createAuditLog({ userId, action: 'SYMBOL_UPDATED', entity: 'Symbol', entityId: symbolId, details: { name: validated.name, workspaceId, affectedPagesCount } });

    return NextResponse.json({ data: symbol, affectedPagesCount });
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

// DELETE /api/workspaces/[workspaceId]/symbols/[symbolId]
export async function DELETE(
  request: NextRequest,
  { params }: RouteContext
) {
  try {
    const { workspaceId, symbolId } = await params;
    const { userId } = await requireWorkspacePermission(workspaceId, 'edit');

    // Verify symbol exists and belongs to this site
    const existing = await prisma.symbol.findUnique({
      where: { id: symbolId },
    });

    if (!existing || existing.workspaceId !== workspaceId) {
      return NextResponse.json({ error: 'Symbol not found' }, { status: 404 });
    }

    await prisma.symbol.delete({
      where: { id: symbolId },
    });

    await createAuditLog({ userId, action: 'SYMBOL_DELETED', entity: 'Symbol', entityId: symbolId, details: { name: existing.name, workspaceId } });

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof Error && error.message.includes('Forbidden')) {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }
    console.error('Error deleting symbol:', error);
    return NextResponse.json({ error: 'Failed to delete symbol' }, { status: 500 });
  }
}
