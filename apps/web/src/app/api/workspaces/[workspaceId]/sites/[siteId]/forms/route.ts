import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@builderly/db';
import { requireWorkspacePermission } from '@/lib/permissions';
import { createAuditLog } from '@/lib/audit';
import { z } from 'zod';

const CreateFormSchema = z.object({
  name: z.string().min(1).max(100),
  slug: z.string().min(1).max(50).regex(/^[a-z0-9-]+$/),
  description: z.string().max(500).optional(),
  schema: z.record(z.any()).optional(),
  submitLabel: z.string().max(50).optional(),
  successMessage: z.string().max(500).optional(),
  redirectUrl: z.string().url().optional().or(z.literal('')),
  notifyEmails: z.array(z.string().email()).optional(),
  enableRecaptcha: z.boolean().optional(),
});

// GET /api/workspaces/[workspaceId]/sites/[siteId]/forms
export async function GET(
  request: NextRequest,
  { params }: { params: { workspaceId: string; siteId: string } }
) {
  try {
    await requireWorkspacePermission(params.workspaceId, 'view');

    const forms = await prisma.form.findMany({
      where: { siteId: params.siteId },
      include: {
        _count: { select: { submissions: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ data: forms });
  } catch (error) {
    if (error instanceof Error && error.message.includes('Forbidden')) {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }
    console.error('Error fetching forms:', error);
    return NextResponse.json({ error: 'Failed to fetch forms' }, { status: 500 });
  }
}

// POST /api/workspaces/[workspaceId]/sites/[siteId]/forms
export async function POST(
  request: NextRequest,
  { params }: { params: { workspaceId: string; siteId: string } }
) {
  try {
    const { userId } = await requireWorkspacePermission(params.workspaceId, 'edit');

    const body = await request.json();
    const validated = CreateFormSchema.parse(body);

    // Check slug uniqueness
    const existing = await prisma.form.findFirst({
      where: {
        siteId: params.siteId,
        slug: validated.slug,
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: 'A form with this slug already exists' },
        { status: 400 }
      );
    }

    const form = await prisma.form.create({
      data: {
        siteId: params.siteId,
        name: validated.name,
        slug: validated.slug,
        description: validated.description,
        schema: validated.schema || { fields: [] },
        submitLabel: validated.submitLabel || 'Submit',
        successMessage: validated.successMessage || 'Thank you for your submission!',
        redirectUrl: validated.redirectUrl || null,
        notifyEmails: validated.notifyEmails || [],
        enableRecaptcha: validated.enableRecaptcha || false,
      },
    });

    await createAuditLog({ userId, action: 'FORM_CREATED', entity: 'Form', entityId: form.id, details: { name: validated.name, slug: validated.slug, siteId: params.siteId } });

    return NextResponse.json(form, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation failed', details: error.errors }, { status: 400 });
    }
    if (error instanceof Error && error.message.includes('Forbidden')) {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }
    console.error('Error creating form:', error);
    return NextResponse.json({ error: 'Failed to create form' }, { status: 500 });
  }
}
