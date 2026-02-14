'use client';

import { ThemeProvider } from 'next-themes';
import { TooltipProvider } from '@builderly/ui';

/**
 * Minimal providers for published site pages.
 * Does NOT include SessionProvider since published sites don't need auth.
 * This avoids unnecessary NextAuth API calls on public pages.
 */
export function PublishedSiteProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem={false}
      disableTransitionOnChange
    >
      <TooltipProvider>
        {children}
      </TooltipProvider>
    </ThemeProvider>
  );
}
