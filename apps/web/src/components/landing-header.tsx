'use client';

import Link from 'next/link';
import { Button } from '@builderly/ui';
import { Layers } from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';

export function LandingHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <Layers className="h-6 w-6 text-primary" />
            <span className="font-bold">Builderly</span>
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <Link href="#features" className="transition-colors hover:text-foreground/80">
              Features
            </Link>
            <Link href="#pricing" className="transition-colors hover:text-foreground/80">
              Pricing
            </Link>
          </nav>
          <div className="flex items-center space-x-2">
            <ThemeToggle />
            <Link href="/login">
              <Button variant="ghost" size="sm">
                Login
              </Button>
            </Link>
            <Link href="/register">
              <Button size="sm">Get Started</Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
