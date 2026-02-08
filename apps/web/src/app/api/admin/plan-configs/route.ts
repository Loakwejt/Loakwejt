import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@builderly/db';
import { getCurrentUser } from '@/lib/permissions';

// ── Hilfs-Funktion: Prüft ob der User ein globaler Admin ist ──
async function requireAdmin() {
  const user = await getCurrentUser();
  if (!user) throw new Error('Unauthorized');

  // Admin = Owner oder Admin in mindestens einem Workspace
  const membership = await prisma.workspaceMember.findFirst({
    where: {
      userId: user.id,
      role: { in: ['OWNER', 'ADMIN'] },
    },
  });

  if (!membership) throw new Error('Forbidden: Admin-Rechte erforderlich');
  return user;
}

// GET /api/admin/plan-configs
// Alle PlanConfig-Einträge abrufen
export async function GET(_request: NextRequest) {
  try {
    await requireAdmin();

    const configs = await (prisma as any).planConfig.findMany({
      orderBy: {
        plan: 'asc',
      },
    });

    // BigInt → Number für JSON-Serialisierung
    const serialized = configs.map((c: any) => ({
      ...c,
      maxStorage: Number(c.maxStorage),
    }));

    return NextResponse.json(serialized);
  } catch (error) {
    if (error instanceof Error && error.message.includes('Unauthorized')) {
      return NextResponse.json({ error: 'Nicht eingeloggt' }, { status: 401 });
    }
    if (error instanceof Error && error.message.includes('Forbidden')) {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }
    console.error('Plan configs fetch error:', error);
    return NextResponse.json(
      { error: 'Fehler beim Laden der Plan-Konfigurationen' },
      { status: 500 }
    );
  }
}
