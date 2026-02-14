import { redirect, notFound } from 'next/navigation';
import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@builderly/db';
import { checkWorkspacePermission } from '@/lib/permissions';
import { SiteUsersClient } from '@/components/dashboard/site-users-client';

interface Props {
  params: { workspaceId: string; siteId: string };
}

export default async function SiteUsersPage({ params }: Props) {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect('/login');

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
    include: {
      workspace: { select: { name: true } },
    },
  });

  if (!site) notFound();

  return (
    <div className="p-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm mb-6">
        <Link
          href="/dashboard"
          className="text-muted-foreground hover:text-foreground"
        >
          Dashboard
        </Link>
        <span className="text-muted-foreground">/</span>
        <Link
          href={`/dashboard/workspaces/${params.workspaceId}`}
          className="text-muted-foreground hover:text-foreground"
        >
          {site.workspace.name}
        </Link>
        <span className="text-muted-foreground">/</span>
        <Link
          href={`/dashboard/workspaces/${params.workspaceId}/sites/${params.siteId}`}
          className="text-muted-foreground hover:text-foreground"
        >
          {site.name}
        </Link>
        <span className="text-muted-foreground">/</span>
        <span>Benutzer</span>
      </div>

      <SiteUsersClient
        workspaceId={params.workspaceId}
        siteId={params.siteId}
        siteName={site.name}
      />
    </div>
  );
}
