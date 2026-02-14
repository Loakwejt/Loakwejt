import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@builderly/db';
import { requireWorkspacePermission } from '@/lib/permissions';
import { createAuditLog } from '@/lib/audit';
import { z } from 'zod';

const UpdateSubmissionSchema = z.object({
  status: z.enum(['NEW', 'READ', 'REPLIED', 'SPAM', 'ARCHIVED']).optional(),
  isSpam: z.boolean().optional(),
});

// GET /api/workspaces/[workspaceId]/forms/[formId]/submissions/[submissionId]
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ workspaceId: string; formId: string; submissionId: string }> }
) {
  const { workspaceId, formId, submissionId } = await params;
  try {
    await requireWorkspacePermission(workspaceId, 'view');

    const submission = await prisma.formSubmission.findFirst({
      where: {
        id: submissionId,
        formId,
      },
      include: {
        form: {
          select: { name: true, slug: true, schema: true },
        },
      },
    });

    if (!submission) {
      return NextResponse.json({ error: 'Submission not found' }, { status: 404 });
    }

    // Mark as read if new
    if (submission.status === 'NEW') {
      await prisma.formSubmission.update({
        where: { id: submissionId },
        data: { status: 'READ', readAt: new Date() },
      });
    }

    return NextResponse.json(submission);
  } catch (error) {
    if (error instanceof Error && error.message.includes('Forbidden')) {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }
    console.error('Error fetching submission:', error);
    return NextResponse.json({ error: 'Failed to fetch submission' }, { status: 500 });
  }
}

// PATCH /api/workspaces/[workspaceId]/forms/[formId]/submissions/[submissionId]
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ workspaceId: string; formId: string; submissionId: string }> }
) {
  const { workspaceId, formId, submissionId } = await params;
  try {
    const { userId } = await requireWorkspacePermission(workspaceId, 'edit');

    const body = await request.json();
    const validated = UpdateSubmissionSchema.parse(body);

    const existing = await prisma.formSubmission.findFirst({
      where: {
        id: submissionId,
        formId,
      },
    });

    if (!existing) {
      return NextResponse.json({ error: 'Submission not found' }, { status: 404 });
    }

    const submission = await prisma.formSubmission.update({
      where: { id: submissionId },
      data: {
        ...(validated.status !== undefined && { status: validated.status }),
        ...(validated.isSpam !== undefined && { isSpam: validated.isSpam }),
        ...(validated.status === 'READ' && !existing.readAt && { readAt: new Date() }),
      },
    });

    await createAuditLog({ userId, action: 'SUBMISSION_UPDATED', entity: 'FormSubmission', entityId: submissionId, details: { formId, status: validated.status } });

    return NextResponse.json(submission);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation failed', details: error.errors }, { status: 400 });
    }
    if (error instanceof Error && error.message.includes('Forbidden')) {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }
    console.error('Error updating submission:', error);
    return NextResponse.json({ error: 'Failed to update submission' }, { status: 500 });
  }
}

// DELETE /api/workspaces/[workspaceId]/forms/[formId]/submissions/[submissionId]
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ workspaceId: string; formId: string; submissionId: string }> }
) {
  const { workspaceId, formId, submissionId } = await params;
  try {
    const { userId } = await requireWorkspacePermission(workspaceId, 'edit');

    const existing = await prisma.formSubmission.findFirst({
      where: {
        id: submissionId,
        formId,
      },
    });

    if (!existing) {
      return NextResponse.json({ error: 'Submission not found' }, { status: 404 });
    }

    await prisma.formSubmission.delete({
      where: { id: submissionId },
    });

    await createAuditLog({ userId, action: 'SUBMISSION_DELETED', entity: 'FormSubmission', entityId: submissionId, details: { formId } });

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof Error && error.message.includes('Forbidden')) {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }
    console.error('Error deleting submission:', error);
    return NextResponse.json({ error: 'Failed to delete submission' }, { status: 500 });
  }
}
