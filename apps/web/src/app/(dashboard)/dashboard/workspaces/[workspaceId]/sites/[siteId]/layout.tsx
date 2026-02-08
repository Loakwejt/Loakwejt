import { redirect, notFound } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@builderly/db';
import { checkWorkspacePermission } from '@/lib/permissions';
import { SiteSidebar } from '@/components/dashboard/site-sidebar';

interface SiteLayoutProps {
  children: React.ReactNode;
  params: { workspaceId: string; siteId: string };
}

export default async function SiteLayout({ children, params }: SiteLayoutProps) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect('/login');

  const hasAccess = await checkWorkspacePermission(
    params.workspaceId,
    session.user.id,
    'view'
  );
  if (!hasAccess) notFound();

  const site = await prisma.site.findFirst({
    where: {
      id: params.siteId,
      workspaceId: params.workspaceId,
    },
    select: {
      name: true,
    },
  });

  if (!site) notFound();

  return (
    <div className="flex">
      <SiteSidebar
        workspaceId={params.workspaceId}
        siteId={params.siteId}
        siteName={site.name}
      />
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}
