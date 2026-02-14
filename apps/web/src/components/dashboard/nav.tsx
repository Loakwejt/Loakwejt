'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  cn,
  Badge,
} from '@builderly/ui';
import { 
  Layers, 
  Settings, 
  LogOut, 
  User, 
  CreditCard, 
  Shield,
  LayoutDashboard,
  HelpCircle,
  Bell,
  Search,
  Command,
  Activity
} from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';

interface NavProps {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
  isAdmin?: boolean;
}

export function DashboardNav({ user, isAdmin = false }: NavProps) {
  const pathname = usePathname();

  const initials = user.name
    ? user.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
    : user.email?.[0]?.toUpperCase() || 'U';

  const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/dashboard/activity', label: 'Activity', icon: Activity },
    { href: '/dashboard/billing', label: 'Billing', icon: CreditCard },
    { href: '/dashboard/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex">
          <Link href="/dashboard" className="mr-6 flex items-center space-x-2">
            <div className="relative">
              <Layers className="h-6 w-6 text-primary" />
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full" />
            </div>
            <span className="font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Builderly
            </span>
          </Link>
        </div>

        {/* Search Bar */}
        <div className="hidden md:flex flex-1 max-w-md mx-4">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search sites, pages..."
              className="w-full h-9 pl-9 pr-12 rounded-md border bg-muted/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1 text-xs text-muted-foreground">
              <kbd className="px-1.5 py-0.5 rounded bg-muted border text-[10px]">⌘</kbd>
              <kbd className="px-1.5 py-0.5 rounded bg-muted border text-[10px]">K</kbd>
            </div>
          </div>
        </div>

        <nav className="flex items-center space-x-1 text-sm font-medium">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-2 px-3 py-2 rounded-md transition-colors',
                  isActive 
                    ? 'bg-primary/10 text-primary' 
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                )}
              >
                <Icon className="h-4 w-4" />
                <span className="hidden lg:inline">{item.label}</span>
              </Link>
            );
          })}
          {isAdmin && (
            <Link
              href="/dashboard/admin"
              className={cn(
                'flex items-center gap-2 px-3 py-2 rounded-md transition-colors',
                pathname?.startsWith('/dashboard/admin') 
                  ? 'bg-primary/10 text-primary' 
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              )}
            >
              <Shield className="h-4 w-4" />
              <span className="hidden lg:inline">Admin</span>
            </Link>
          )}
        </nav>

        <div className="flex flex-1 items-center justify-end space-x-2">
          {/* Help Button */}
          <Button variant="ghost" size="sm" className="text-muted-foreground">
            <HelpCircle className="h-4 w-4" />
          </Button>

          {/* Theme Toggle */}
          <ThemeToggle />

          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="relative text-muted-foreground">
                <Bell className="h-4 w-4" />
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 rounded-full text-[10px] text-white flex items-center justify-center">
                  3
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-80" align="end">
              <DropdownMenuLabel className="flex items-center justify-between">
                Notifications
                <Badge variant="secondary" className="text-xs">3 new</Badge>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="max-h-80 overflow-y-auto">
                <DropdownMenuItem className="flex flex-col items-start gap-1 py-3 cursor-pointer">
                  <p className="text-sm font-medium">Your site is published!</p>
                  <p className="text-xs text-muted-foreground">handwerker-meister.builderly.io is now live</p>
                  <p className="text-xs text-muted-foreground">2 hours ago</p>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex flex-col items-start gap-1 py-3 cursor-pointer">
                  <p className="text-sm font-medium">New team member joined</p>
                  <p className="text-xs text-muted-foreground">john@example.com joined your workspace</p>
                  <p className="text-xs text-muted-foreground">1 day ago</p>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex flex-col items-start gap-1 py-3 cursor-pointer">
                  <p className="text-sm font-medium">Welcome to Builderly! 🎉</p>
                  <p className="text-xs text-muted-foreground">Get started by creating your first site</p>
                  <p className="text-xs text-muted-foreground">3 days ago</p>
                </DropdownMenuItem>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-center text-primary cursor-pointer">
                View all notifications
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8 ring-2 ring-primary/20">
                  <AvatarImage src={user.image || ''} alt={user.name || ''} />
                  <AvatarFallback className="bg-primary/10 text-primary">{initials}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{user.name}</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/dashboard/settings" className="cursor-pointer">
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/dashboard/settings" className="cursor-pointer">
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/dashboard/billing" className="cursor-pointer">
                  <CreditCard className="mr-2 h-4 w-4" />
                  Billing
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={() => signOut({ callbackUrl: '/' })}
                className="cursor-pointer text-red-600 focus:text-red-600"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
