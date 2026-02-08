'use client';

import { Button } from '@builderly/ui';

interface SiteInfo {
  id: string;
  name: string;
}

interface WorkspaceSiteSelectorProps {
  sites: SiteInfo[];
  activeSiteId: string;
  onSelect: (siteId: string) => void;
}

/**
 * Zeigt eine Site-Auswahl wenn mehr als eine Site im Workspace existiert.
 */
export function WorkspaceSiteSelector({
  sites,
  activeSiteId,
  onSelect,
}: WorkspaceSiteSelectorProps) {
  if (sites.length <= 1) return null;

  return (
    <div className="flex items-center gap-2 pb-4 border-b mb-4">
      <span className="text-sm text-muted-foreground">Site:</span>
      {sites.map((site) => (
        <Button
          key={site.id}
          variant={activeSiteId === site.id ? 'secondary' : 'ghost'}
          size="sm"
          onClick={() => onSelect(site.id)}
        >
          {site.name}
        </Button>
      ))}
    </div>
  );
}
