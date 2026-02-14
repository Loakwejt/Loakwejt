'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@builderly/ui';
import {
  LayoutDashboard,
  Settings2,
  Users,
  Building2,
  Palette,
  FileText,
  Shield,
  BarChart3,
  ChevronLeft,
} from 'lucide-react';

const adminNavItems = [
  {
    label: 'Übersicht',
    href: '/dashboard/admin',
    icon: LayoutDashboard,
  },
  {
    label: 'Plan-Konfiguration',
    href: '/dashboard/admin/plans',
    icon: Settings2,
  },
  {
    label: 'Benutzer',
    href: '/dashboard/admin/users',
    icon: Users,
  },
  {
    label: 'Workspaces',
    href: '/dashboard/admin/workspaces',
    icon: Building2,
  },
  {
    label: 'Templates',
    href: '/dashboard/admin/templates',
    icon: Palette,
  },
  {
    label: 'Audit-Log',
    href: '/dashboard/admin/audit-log',
    icon: FileText,
  },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 shrink-0 border-r bg-muted/30 min-h-[calc(100vh-3.5rem)]">
      <div className="p-4 space-y-1">
        {/* Back to Dashboard */}
        <Link
          href="/dashboard"
          className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:text-foreground rounded-md hover:bg-muted transition-colors mb-4"
        >
          <ChevronLeft className="h-4 w-4" />
          Zurück zum Dashboard
        </Link>

        {/* Admin Header */}
        <div className="flex items-center gap-2 px-3 py-2 mb-2">
          <div className="p-1.5 rounded-lg bg-primary/10">
            <Shield className="h-4 w-4 text-primary" />
          </div>
          <span className="font-semibold text-sm">Admin-Panel</span>
        </div>

        {/* Nav Items */}
        {adminNavItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            item.href === '/dashboard/admin'
              ? pathname === '/dashboard/admin'
              : pathname?.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-all duration-150',
                isActive
                  ? 'bg-primary/10 text-primary font-medium'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </div>
    </aside>
  );
}
