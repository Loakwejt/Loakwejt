import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@builderly/db';
import { requireWorkspacePermission } from '@/lib/permissions';
import { createAuditLog } from '@/lib/audit';
import { z } from 'zod';

const UpdateFormSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  description: z.string().max(500).optional(),
  schema: z.record(z.any()).optional(),
  submitLabel: z.string().max(50).optional(),
  successMessage: z.string().max(500).optional(),
  redirectUrl: z.string().url().optional().or(z.literal('')).nullable(),
  notifyEmails: z.array(z.string().email()).optional(),
  enableRecaptcha: z.boolean().optional(),
  isActive: z.boolean().optional(),
});

// GET /api/workspaces/[workspaceId]/forms/[formId]
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ workspaceId: string; formId: string }> }
) {
  try {
    const { workspaceId, formId } = await params;
    await requireWorkspacePermission(workspaceId, 'view');

    const form = await prisma.form.findFirst({
      where: {
        id: formId,
        workspaceId,
      },
      include: {
        _count: {
          select: {
            submissions: true,
          },
        },
      },
    });

    if (!form) {
      return NextResponse.json({ error: 'Form not found' }, { status: 404 });
    }

    // Get submission stats
    const stats = await prisma.formSubmission.groupBy({
      by: ['status'],
      where: { formId },
      _count: { id: true },
    });

    return NextResponse.json({
      ...form,
      stats: stats.reduce((acc: Record<string, number>, s: { status: string; _count: { id: number } }) => {
        acc[s.status.toLowerCase()] = s._count.id;
        return acc;
      }, {} as Record<string, number>),
    });
  } catch (error) {
    if (error instanceof Error && error.message.includes('Forbidden')) {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }
    console.error('Error fetching form:', error);
    return NextResponse.json({ error: 'Failed to fetch form' }, { status: 500 });
  }
}

// PATCH /api/workspaces/[workspaceId]/forms/[formId]
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ workspaceId: string; formId: string }> }
) {
  try {
    const { workspaceId, formId } = await params;
    const { userId } = await requireWorkspacePermission(workspaceId, 'edit');

    const body = await request.json();
    const validated = UpdateFormSchema.parse(body);

    // Verify form exists
    const existing = await prisma.form.findFirst({
      where: {
        id: formId,
        workspaceId,
      },
    });

    if (!existing) {
      return NextResponse.json({ error: 'Form not found' }, { status: 404 });
    }

    const form = await prisma.form.update({
      where: { id: formId },
      data: {
        ...(validated.name !== undefined && { name: validated.name }),
        ...(validated.description !== undefined && { description: validated.description }),
        ...(validated.schema !== undefined && { schema: validated.schema }),
        ...(validated.submitLabel !== undefined && { submitLabel: validated.submitLabel }),
        ...(validated.successMessage !== undefined && { successMessage: validated.successMessage }),
        ...(validated.redirectUrl !== undefined && { redirectUrl: validated.redirectUrl || null }),
        ...(validated.notifyEmails !== undefined && { notifyEmails: validated.notifyEmails }),
        ...(validated.enableRecaptcha !== undefined && { enableRecaptcha: validated.enableRecaptcha }),
        ...(validated.isActive !== undefined && { isActive: validated.isActive }),
      },
    });

    await createAuditLog({ userId, action: 'FORM_UPDATED', entity: 'Form', entityId: formId, details: { name: validated.name, workspaceId } });

    return NextResponse.json(form);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation failed', details: error.errors }, { status: 400 });
    }
    if (error instanceof Error && error.message.includes('Forbidden')) {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }
    console.error('Error updating form:', error);
    return NextResponse.json({ error: 'Failed to update form' }, { status: 500 });
  }
}

// DELETE /api/workspaces/[workspaceId]/forms/[formId]
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ workspaceId: string; formId: string }> }
) {
  try {
    const { workspaceId, formId } = await params;
    const { userId } = await requireWorkspacePermission(workspaceId, 'edit');

    // Verify form exists
    const existing = await prisma.form.findFirst({
      where: {
        id: formId,
        workspaceId,
      },
    });

    if (!existing) {
      return NextResponse.json({ error: 'Form not found' }, { status: 404 });
    }

    await prisma.form.delete({
      where: { id: formId },
    });

    await createAuditLog({ userId, action: 'FORM_DELETED', entity: 'Form', entityId: formId, details: { name: existing.name, workspaceId } });

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof Error && error.message.includes('Forbidden')) {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }
    console.error('Error deleting form:', error);
    return NextResponse.json({ error: 'Failed to delete form' }, { status: 500 });
  }
}
