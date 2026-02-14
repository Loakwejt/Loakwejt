import { NextRequest, NextResponse } from 'next/server';
import { requireWorkspacePermission } from '@/lib/permissions';
import { prisma } from '@builderly/db';
import { canAddTeamMember } from '@/lib/entitlements';
import { createAuditLog } from '@/lib/audit';
import { z } from 'zod';

const InviteMemberSchema = z.object({
  email: z.string().email('Ungültige E-Mail-Adresse'),
  role: z.enum(['VIEWER', 'EDITOR', 'ADMIN']),
});

// GET /api/workspaces/[workspaceId]/members
// Alle Mitglieder eines Workspace auflisten
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ workspaceId: string }> }
) {
  const { workspaceId } = await params;
  try {
    await requireWorkspacePermission(workspaceId, 'view');

    const members = await prisma.workspaceMember.findMany({
      where: { workspaceId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
      },
      orderBy: { createdAt: 'asc' },
    });

    return NextResponse.json(members);
  } catch (error) {
    if (error instanceof Error && error.message.includes('Forbidden')) {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }
    console.error('Members fetch error:', error);
    return NextResponse.json({ error: 'Fehler beim Laden der Mitglieder' }, { status: 500 });
  }
}

// POST /api/workspaces/[workspaceId]/members
// Neues Mitglied einladen (mit Plan-Limit Check)
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ workspaceId: string }> }
) {
  const { workspaceId } = await params;
  try {
    await requireWorkspacePermission(workspaceId, 'admin');

    const body = await request.json();
    const { email, role } = InviteMemberSchema.parse(body);

    // ── Plan-Limit prüfen ──
    const limitCheck = await canAddTeamMember(workspaceId);
    if (!limitCheck.allowed) {
      return NextResponse.json(
        { error: limitCheck.reason },
        { status: 403 }
      );
    }

    // Benutzer anhand der E-Mail finden
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        {
          error: `Kein Benutzer mit der E-Mail "${email}" gefunden. Der Benutzer muss sich zuerst bei Builderly registrieren.`,
        },
        { status: 404 }
      );
    }

    // Prüfen ob bereits Mitglied
    const existing = await prisma.workspaceMember.findUnique({
      where: {
        workspaceId_userId: {
          workspaceId,
          userId: user.id,
        },
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: 'Dieser Benutzer ist bereits Mitglied des Workspace.' },
        { status: 409 }
      );
    }

    // Mitglied erstellen
    const member = await prisma.workspaceMember.create({
      data: {
        workspaceId,
        userId: user.id,
        role,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
      },
    });

    await createAuditLog({
      userId: user.id,
      action: 'MEMBER_INVITED',
      entity: 'WorkspaceMember',
      entityId: member.id,
      details: { workspaceId, email, role },
    });

    return NextResponse.json(member, { status: 201 });
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
    console.error('Member invite error:', error);
    return NextResponse.json(
      { error: 'Fehler beim Hinzufügen des Mitglieds' },
      { status: 500 }
    );
  }
}
