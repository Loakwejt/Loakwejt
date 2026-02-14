import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@builderly/db';
import { WorkspaceSidebar } from '@/components/dashboard/workspace-sidebar';

interface WorkspaceLayoutProps {
  children: React.ReactNode;
  params: Promise<{ workspaceId: string }>;
}

export default async function WorkspaceLayout({
  children,
  params,
}: WorkspaceLayoutProps) {
  const { workspaceId } = await params;
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect('/login');
  }

  // Verify user has access to workspace
  const membership = await prisma.workspaceMember.findFirst({
    where: {
      workspaceId,
      userId: session.user.id,
    },
    include: {
      workspace: {
        select: { name: true, type: true },
      },
    },
  });

  if (!membership) {
    redirect('/dashboard');
  }

  return (
    <div className="flex">
      <WorkspaceSidebar
        workspaceId={workspaceId}
        workspaceName={membership.workspace.name}
        workspaceType={(membership.workspace as any).type || 'WEBSITE'}
      />
      <main className="flex-1 min-h-[calc(100vh-3.5rem)] overflow-auto">
        {children}
      </main>
    </div>
  );
}
