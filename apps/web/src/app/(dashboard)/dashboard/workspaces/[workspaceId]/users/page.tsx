'use client';

import { useParams } from 'next/navigation';
import { SiteUsersClient } from '@/components/dashboard/site-users-client';

export default function WorkspaceUsersPage() {
  const params = useParams<{ workspaceId: string }>();

  return (
    <div className="p-6 space-y-6">
      <SiteUsersClient
        workspaceId={params.workspaceId}
        siteName=""
      />
    </div>
  );
}
