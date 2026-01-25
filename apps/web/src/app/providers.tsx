'use client';

import { SessionProvider } from 'next-auth/react';
import { TooltipProvider } from '@builderly/ui';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <TooltipProvider>
        {children}
      </TooltipProvider>
    </SessionProvider>
  );
}
