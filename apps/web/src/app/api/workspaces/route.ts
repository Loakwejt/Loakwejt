import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@builderly/db';
import { getCurrentUser } from '@/lib/permissions';
import { CreateWorkspaceSchema } from '@builderly/sdk';
import { createAuditLog } from '@/lib/audit';

// GET /api/workspaces - List workspaces for current user
export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const memberships = await prisma.workspaceMember.findMany({
      where: { userId: user.id },
      include: {
        workspace: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    const workspaces = memberships.map((m: typeof memberships[number]) => ({
      ...m.workspace,
      role: m.role,
    }));

    return NextResponse.json({ data: workspaces });
  } catch (error) {
    console.error('Error fetching workspaces:', error);
    return NextResponse.json({ error: 'Failed to fetch workspaces' }, { status: 500 });
  }
}

// POST /api/workspaces - Create a new workspace
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validated = CreateWorkspaceSchema.parse(body);

    // Check if slug is unique
    const existing = await prisma.workspace.findUnique({
      where: { slug: validated.slug },
    });

    if (existing) {
      return NextResponse.json(
        { error: 'A workspace with this slug already exists' },
        { status: 400 }
      );
    }

    const workspace = await prisma.workspace.create({
      data: {
        name: validated.name,
        slug: validated.slug,
        description: validated.description,
        type: (validated as any).type ?? 'WEBSITE',
        logoUrl: validated.logoUrl || undefined,
        companyName: validated.companyName || undefined,
        companyEmail: validated.companyEmail || undefined,
        companyPhone: validated.companyPhone || undefined,
        companyAddress: validated.companyAddress || undefined,
        companyVatId: validated.companyVatId || undefined,
        companyWebsite: validated.companyWebsite || undefined,
        members: {
          create: {
            userId: user.id,
            role: 'OWNER',
          },
        },
      },
    });

    await createAuditLog({
      userId: user.id,
      action: 'WORKSPACE_CREATED',
      entity: 'Workspace',
      entityId: workspace.id,
      details: { name: workspace.name, slug: workspace.slug },
    });

    return NextResponse.json(workspace, { status: 201 });
  } catch (error) {
    console.error('Error creating workspace:', error);
    return NextResponse.json({ error: 'Failed to create workspace' }, { status: 500 });
  }
}
