import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@builderly/db';
import { DashboardNav } from '@/components/dashboard/nav';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/login');
  }

  // Check if user is admin (OWNER or ADMIN in any workspace)
  const adminMembership = await prisma.workspaceMember.findFirst({
    where: {
      userId: session.user.id,
      role: { in: ['OWNER', 'ADMIN'] },
    },
  });
  const isAdmin = !!adminMembership;

  return (
    <div className="min-h-screen">
      <DashboardNav user={session.user} isAdmin={isAdmin} />
      <main className="container py-6">{children}</main>
    </div>
  );
}
