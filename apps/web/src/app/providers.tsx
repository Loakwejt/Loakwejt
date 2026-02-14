'use client';

import { SessionProvider } from 'next-auth/react';
import { ThemeProvider } from 'next-themes';
import { TooltipProvider } from '@builderly/ui';
import { CookieConsentBanner } from '@/components/cookie-consent';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <TooltipProvider>
          {children}
          <CookieConsentBanner />
        </TooltipProvider>
      </ThemeProvider>
    </SessionProvider>
  );
}
