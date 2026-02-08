import { NextRequest, NextResponse } from 'next/server';
import { requireWorkspacePermission } from '@/lib/permissions';
import { prisma } from '@builderly/db';
import { createAuditLog } from '@/lib/audit';
import { z } from 'zod';

const UpdateMemberSchema = z.object({
  role: z.enum(['VIEWER', 'EDITOR', 'ADMIN']),
});

// PATCH /api/workspaces/[workspaceId]/members/[memberId]
// Rolle eines Mitglieds ändern
export async function PATCH(
  request: NextRequest,
  { params }: { params: { workspaceId: string; memberId: string } }
) {
  try {
    const { userId } = await requireWorkspacePermission(params.workspaceId, 'admin');

    const body = await request.json();
    const { role } = UpdateMemberSchema.parse(body);

    // Prüfen ob das Mitglied existiert
    const member = await prisma.workspaceMember.findFirst({
      where: {
        id: params.memberId,
        workspaceId: params.workspaceId,
      },
    });

    if (!member) {
      return NextResponse.json({ error: 'Mitglied nicht gefunden' }, { status: 404 });
    }

    // Owner-Rolle kann nicht geändert werden
    if (member.role === 'OWNER') {
      return NextResponse.json(
        { error: 'Die Rolle des Eigentümers kann nicht geändert werden.' },
        { status: 403 }
      );
    }

    const updated = await prisma.workspaceMember.update({
      where: { id: params.memberId },
      data: { role },
      include: {
        user: {
          select: { id: true, name: true, email: true, image: true },
        },
      },
    });

    await createAuditLog({
      userId,
      action: 'MEMBER_ROLE_CHANGED',
      entity: 'WorkspaceMember',
      entityId: params.memberId,
      details: { workspaceId: params.workspaceId, oldRole: member.role, newRole: role },
    });

    return NextResponse.json(updated);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Ungültige Eingabe', details: error.errors },
        { status: 400 }
      );
    }
    if (error instanceof Error && error.message.includes('Forbidden')) {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }
    console.error('Update member error:', error);
    return NextResponse.json(
      { error: 'Fehler beim Aktualisieren des Mitglieds' },
      { status: 500 }
    );
  }
}

// DELETE /api/workspaces/[workspaceId]/members/[memberId]
// Mitglied entfernen
export async function DELETE(
  _request: NextRequest,
  { params }: { params: { workspaceId: string; memberId: string } }
) {
  try {
    const { userId } = await requireWorkspacePermission(params.workspaceId, 'admin');

    const member = await prisma.workspaceMember.findFirst({
      where: {
        id: params.memberId,
        workspaceId: params.workspaceId,
      },
    });

    if (!member) {
      return NextResponse.json({ error: 'Mitglied nicht gefunden' }, { status: 404 });
    }

    // Owner kann nicht entfernt werden
    if (member.role === 'OWNER') {
      return NextResponse.json(
        { error: 'Der Eigentümer kann nicht entfernt werden.' },
        { status: 403 }
      );
    }

    await prisma.workspaceMember.delete({
      where: { id: params.memberId },
    });

    await createAuditLog({
      userId,
      action: 'MEMBER_REMOVED',
      entity: 'WorkspaceMember',
      entityId: params.memberId,
      details: { workspaceId: params.workspaceId, removedUserId: member.userId, role: member.role },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof Error && error.message.includes('Forbidden')) {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }
    console.error('Delete member error:', error);
    return NextResponse.json(
      { error: 'Fehler beim Entfernen des Mitglieds' },
      { status: 500 }
    );
  }
}
