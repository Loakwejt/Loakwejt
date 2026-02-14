'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@builderly/ui';
import {
  LayoutDashboard,
  Image,
  Database,
  Settings,
  ChevronLeft,
  ShoppingBag,
  Receipt,
  MessageSquare,
  BarChart3,
  FileInput,
  Users,
  BookOpen,
  Briefcase,
  Rocket,
  Tag,
  FolderTree,
  CreditCard,
  Truck,
  Cog,
  Star,
  Percent,
  Ticket,
  Package,
  ShoppingCart,
  FileText,
  FileCheck,
  FileMinus,
  FilePlus,
  Mail,
  CalendarDays,
  Repeat,
  Zap,
  ClipboardList,
  Scale,
} from 'lucide-react';

interface SidebarLink {
  href: string;
  label: string;
  icon: typeof LayoutDashboard;
  exact?: boolean;
}

interface SidebarSection {
  title?: string;
  links: SidebarLink[];
}

interface WorkspaceSidebarProps {
  workspaceId: string;
  workspaceName?: string;
  workspaceType?: string;
}

// Typ-spezifische Links & Sections
function getTypeSections(basePath: string, type: string): SidebarSection[] {
  switch (type) {
    case 'SHOP':
      return [
        {
          title: 'Shop',
          links: [
            { href: `${basePath}/products`, label: 'Produkte', icon: ShoppingBag },
            { href: `${basePath}/categories`, label: 'Kategorien', icon: FolderTree },
            { href: `${basePath}/orders`, label: 'Bestellungen', icon: Receipt },
            { href: `${basePath}/coupons`, label: 'Coupons & Rabatte', icon: Tag },
            { href: `${basePath}/vouchers`, label: 'Gutscheine', icon: Ticket },
            { href: `${basePath}/reviews`, label: 'Bewertungen', icon: Star },
            { href: `${basePath}/carts`, label: 'Warenkörbe', icon: ShoppingCart },
            { href: `${basePath}/inventory`, label: 'Lagerverwaltung', icon: Package },
          ],
        },
        {
          title: 'Finanzen',
          links: [
            { href: `${basePath}/invoices`, label: 'Rechnungen', icon: FileText },
            { href: `${basePath}/credit-notes`, label: 'Gutschriften', icon: FileMinus },
            { href: `${basePath}/debit-notes`, label: 'Belastungsanzeigen', icon: FilePlus },
            { href: `${basePath}/quotes`, label: 'Angebote', icon: FileCheck },
            { href: `${basePath}/claims`, label: 'Reklamationen', icon: ClipboardList },
            { href: `${basePath}/tax-zones`, label: 'Steuerzonen', icon: Scale },
            { href: `${basePath}/invoice-settings`, label: 'Rechnungseinst.', icon: Cog },
          ],
        },
        {
          title: 'Erweitert',
          links: [
            { href: `${basePath}/subscriptions`, label: 'Abonnements', icon: Repeat },
            { href: `${basePath}/bookings`, label: 'Buchungen', icon: CalendarDays },
            { href: `${basePath}/email-templates`, label: 'E-Mail-Vorlagen', icon: Mail },
            { href: `${basePath}/automations`, label: 'Automatisierungen', icon: Zap },
          ],
        },
        {
          title: 'Konfiguration',
          links: [
            { href: `${basePath}/payments`, label: 'Zahlungsmethoden', icon: CreditCard },
            { href: `${basePath}/shipping`, label: 'Versand', icon: Truck },
            { href: `${basePath}/shop-settings`, label: 'Shop-Einstellungen', icon: Cog },
          ],
        },
      ];
    case 'FORUM':
      return [
        {
          title: 'Community',
          links: [
            { href: `${basePath}/forum`, label: 'Forum', icon: MessageSquare },
          ],
        },
      ];
    case 'BLOG':
      return [
        {
          title: 'Blog',
          links: [
            { href: `${basePath}/analytics`, label: 'Analytics', icon: BarChart3 },
          ],
        },
      ];
    case 'WIKI':
      return [
        {
          title: 'Wiki',
          links: [
            { href: `${basePath}/analytics`, label: 'Analytics', icon: BarChart3 },
          ],
        },
      ];
    case 'PORTFOLIO':
      return [
        {
          title: 'Portfolio',
          links: [
            { href: `${basePath}/analytics`, label: 'Analytics', icon: BarChart3 },
            { href: `${basePath}/forms`, label: 'Formulare', icon: FileInput },
          ],
        },
      ];
    case 'LANDING':
      return [
        {
          title: 'Landing Page',
          links: [
            { href: `${basePath}/analytics`, label: 'Analytics', icon: BarChart3 },
            { href: `${basePath}/forms`, label: 'Formulare', icon: FileInput },
          ],
        },
      ];
    case 'WEBSITE':
    default:
      return [
        {
          title: 'Erweiterungen',
          links: [
            { href: `${basePath}/products`, label: 'Produkte', icon: ShoppingBag },
            { href: `${basePath}/orders`, label: 'Bestellungen', icon: Receipt },
            { href: `${basePath}/forum`, label: 'Forum', icon: MessageSquare },
            { href: `${basePath}/analytics`, label: 'Analytics', icon: BarChart3 },
            { href: `${basePath}/forms`, label: 'Formulare', icon: FileInput },
          ],
        },
      ];
  }
}

export function WorkspaceSidebar({
  workspaceId,
  workspaceName,
  workspaceType = 'WEBSITE',
}: WorkspaceSidebarProps) {
  const pathname = usePathname();
  const basePath = `/dashboard/workspaces/${workspaceId}`;

  const mainLinks: SidebarLink[] = [
    { href: basePath, label: 'Übersicht', icon: LayoutDashboard, exact: true },
    { href: `${basePath}/assets`, label: 'Medien', icon: Image },
    { href: `${basePath}/collections`, label: 'Sammlungen', icon: Database },
  ];

  const typeSections = getTypeSections(basePath, workspaceType);

  const bottomLinks: SidebarLink[] = [
    { href: `${basePath}/users`, label: 'Benutzer', icon: Users },
    { href: `${basePath}/settings`, label: 'Einstellungen', icon: Settings },
  ];

  const isActive = (href: string, exact = false) => {
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  };

  const renderLink = (link: SidebarLink) => {
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
  };

  return (
    <aside className="w-64 border-r bg-muted/40 min-h-[calc(100vh-3.5rem)] flex flex-col">
      <div className="p-4">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
          Zurück zum Dashboard
        </Link>
        {workspaceName && (
          <h2 className="mt-4 font-semibold truncate">{workspaceName}</h2>
        )}
      </div>

      <nav className="flex-1 px-2 py-4 space-y-4">
        {/* Haupt-Navigation */}
        <div className="space-y-1">
          {mainLinks.map(renderLink)}
        </div>

        {/* Typ-spezifische Sections */}
        {typeSections.map((section, idx) => (
          <div key={idx}>
            {section.title && (
              <p className="px-3 mb-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60">
                {section.title}
              </p>
            )}
            <div className="space-y-1">
              {section.links.map(renderLink)}
            </div>
          </div>
        ))}

        {/* Untere Links */}
        <div className="space-y-1 pt-4 border-t">
          {bottomLinks.map(renderLink)}
        </div>
      </nav>
    </aside>
  );
}
