import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@builderly/db';
import { requireWorkspacePermission } from '@/lib/permissions';
import { createAuditLog } from '@/lib/audit';
import { z } from 'zod';

// Schema for creating a symbol
const CreateSymbolSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  category: z.string().optional(),
  tree: z.any(), // BuilderNode JSON
  thumbnailUrl: z.string().optional(),
});

// Schema for updating a symbol
const UpdateSymbolSchema = CreateSymbolSchema.partial();

interface RouteContext {
  params: Promise<{ workspaceId: string }>;
}

// GET /api/workspaces/[workspaceId]/symbols
export async function GET(
  request: NextRequest,
  { params }: RouteContext
) {
  try {
    const { workspaceId } = await params;
    await requireWorkspacePermission(workspaceId, 'view');

    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');

    const symbols = await prisma.symbol.findMany({
      where: { 
        workspaceId,
        ...(category ? { category } : {}),
      },
      orderBy: [
        { category: 'asc' },
        { name: 'asc' },
      ],
    });

    return NextResponse.json({ data: symbols });
  } catch (error) {
    if (error instanceof Error && error.message.includes('Forbidden')) {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }
    console.error('Error fetching symbols:', error);
    return NextResponse.json({ error: 'Failed to fetch symbols' }, { status: 500 });
  }
}

// POST /api/workspaces/[workspaceId]/symbols
export async function POST(
  request: NextRequest,
  { params }: RouteContext
) {
  try {
    const { workspaceId } = await params;
    const { userId } = await requireWorkspacePermission(workspaceId, 'edit');

    const body = await request.json();
    const validated = CreateSymbolSchema.parse(body);

    // Check if name is unique within site
    const existing = await prisma.symbol.findUnique({
      where: {
        workspaceId_name: {
          workspaceId,
          name: validated.name,
        },
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: 'Ein Symbol mit diesem Namen existiert bereits' },
        { status: 400 }
      );
    }

    const symbol = await prisma.symbol.create({
      data: {
        workspaceId,
        name: validated.name,
        description: validated.description,
        category: validated.category || 'other',
        tree: validated.tree,
        thumbnailUrl: validated.thumbnailUrl,
      },
    });

    await createAuditLog({ userId, action: 'SYMBOL_CREATED', entity: 'Symbol', entityId: symbol.id, details: { name: validated.name, category: validated.category, workspaceId } });

    return NextResponse.json({ data: symbol }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    if (error instanceof Error && error.message.includes('Forbidden')) {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }
    console.error('Error creating symbol:', error);
    return NextResponse.json({ error: 'Failed to create symbol' }, { status: 500 });
  }
}
