'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@builderly/ui';
import {
  ChevronLeft,
  Globe,
  FileText,
} from 'lucide-react';

interface SiteSidebarProps {
  workspaceId: string;
  siteId: string;
  siteName: string;
}

export function SiteSidebar({
  workspaceId,
  siteId,
  siteName,
}: SiteSidebarProps) {
  const pathname = usePathname();
  const basePath = `/dashboard/workspaces/${workspaceId}/sites/${siteId}`;

  const links = [
    { href: basePath, label: 'Übersicht', icon: Globe, exact: true },
  ];

  const isActive = (href: string, exact = false) => {
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  };

  return (
    <aside className="w-56 border-r bg-muted/30 min-h-[calc(100vh-3.5rem)] flex flex-col">
      <div className="p-3 border-b">
        <Link
          href={`/dashboard/workspaces/${workspaceId}/sites`}
          className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronLeft className="h-3.5 w-3.5" />
          Zurück zu Sites
        </Link>
        <h2 className="mt-2 font-semibold text-sm truncate">{siteName}</h2>
      </div>

      <nav className="flex-1 px-2 py-3 space-y-0.5">
        {links.map((link) => {
          const Icon = link.icon;
          const active = isActive(link.href, link.exact);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'flex items-center gap-2.5 rounded-md px-3 py-1.5 text-sm transition-colors',
                active
                  ? 'bg-primary text-primary-foreground font-medium'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              )}
            >
              <Icon className="h-4 w-4 flex-shrink-0" />
              {link.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
