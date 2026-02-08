import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@builderly/db';
import { AdminSidebar } from '@/components/dashboard/admin-sidebar';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect('/login');

  // Admin-Check: OWNER oder ADMIN in mindestens einem Workspace
  const adminMembership = await prisma.workspaceMember.findFirst({
    where: {
      userId: session.user.id,
      role: { in: ['OWNER', 'ADMIN'] },
    },
  });

  if (!adminMembership) {
    redirect('/dashboard');
  }

  return (
    <div className="flex -mt-6 -mx-4 sm:-mx-6 lg:-mx-8">
      <AdminSidebar />
      <div className="flex-1 p-6 min-h-[calc(100vh-3.5rem)] overflow-auto">
        {children}
      </div>
    </div>
  );
}
