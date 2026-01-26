'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@builderly/ui';
import {
  LayoutDashboard,
  Globe,
  Image,
  Database,
  Settings,
  ChevronLeft,
} from 'lucide-react';

interface WorkspaceSidebarProps {
  workspaceId: string;
  workspaceName?: string;
}

export function WorkspaceSidebar({ workspaceId, workspaceName }: WorkspaceSidebarProps) {
  const pathname = usePathname();
  const basePath = `/dashboard/workspaces/${workspaceId}`;

  const links = [
    {
      href: basePath,
      label: 'Overview',
      icon: LayoutDashboard,
      exact: true,
    },
    {
      href: `${basePath}/sites`,
      label: 'Sites',
      icon: Globe,
    },
    {
      href: `${basePath}/assets`,
      label: 'Assets',
      icon: Image,
    },
    {
      href: `${basePath}/collections`,
      label: 'Collections',
      icon: Database,
    },
    {
      href: `${basePath}/settings`,
      label: 'Settings',
      icon: Settings,
    },
  ];

  const isActive = (href: string, exact = false) => {
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  };

  return (
    <aside className="w-64 border-r bg-muted/40 min-h-[calc(100vh-3.5rem)]">
      <div className="p-4">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to Dashboard
        </Link>
        {workspaceName && (
          <h2 className="mt-4 font-semibold truncate">{workspaceName}</h2>
        )}
      </div>

      <nav className="px-2 py-4 space-y-1">
        {links.map((link) => {
          const Icon = link.icon;
          const active = isActive(link.href, link.exact);

          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                active
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              )}
            >
              <Icon className="h-4 w-4" />
              {link.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
