'use client';

import { useEffect, useState } from 'react';

interface SiteInfo {
  id: string;
  name: string;
}

/**
 * Resolves the default/first site for a workspace.
 * Used by workspace-level feature pages to find the siteId
 * needed for existing site-level APIs.
 */
export function useWorkspaceSite(workspaceId: string) {
  const [sites, setSites] = useState<SiteInfo[]>([]);
  const [activeSiteId, setActiveSiteId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadSites() {
      try {
        const res = await fetch(`/api/workspaces/${workspaceId}/sites`);
        if (!res.ok) throw new Error('Fehler beim Laden der Sites');
        const data = await res.json();
        const siteList: SiteInfo[] = (data.data || data.sites || data || []).map((s: any) => ({
          id: s.id,
          name: s.name,
        }));
        setSites(siteList);
        if (siteList.length > 0) {
          setActiveSiteId(siteList[0].id);
        }
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }
    loadSites();
  }, [workspaceId]);

  return {
    sites,
    activeSiteId,
    setActiveSiteId,
    loading,
    error,
    hasSites: sites.length > 0,
  };
}
