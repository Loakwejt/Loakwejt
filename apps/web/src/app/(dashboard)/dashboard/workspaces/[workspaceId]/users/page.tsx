'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import {
  Card,
  CardContent,
} from '@builderly/ui';
import { Users, AlertCircle } from 'lucide-react';
import { useWorkspaceSite } from '@/hooks/use-workspace-site';
import { WorkspaceSiteSelector } from '@/components/dashboard/workspace-site-selector';
import { SiteUsersClient } from '@/components/dashboard/site-users-client';

export default function WorkspaceUsersPage() {
  const params = useParams<{ workspaceId: string }>();
  const { sites, activeSiteId, setActiveSiteId, loading: sitesLoading, hasSites } = useWorkspaceSite(params.workspaceId);

  if (sitesLoading) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold">Benutzer</h1>
        <p className="text-muted-foreground mt-2">Laden...</p>
      </div>
    );
  }

  if (!hasSites || !activeSiteId) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold">Benutzer</h1>
        <Card className="mt-6">
          <CardContent className="py-12 text-center">
            <AlertCircle className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
            <h3 className="font-semibold mb-1">Keine Site vorhanden</h3>
            <p className="text-sm text-muted-foreground">Erstelle zuerst eine Site, um Benutzer zu verwalten.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const activeSite = sites.find(s => s.id === activeSiteId);

  return (
    <div className="p-6 space-y-6">
      <WorkspaceSiteSelector
        sites={sites}
        activeSiteId={activeSiteId}
        onSelect={setActiveSiteId}
      />
      <SiteUsersClient
        workspaceId={params.workspaceId}
        siteId={activeSiteId}
        siteName={activeSite?.name || ''}
      />
    </div>
  );
}
