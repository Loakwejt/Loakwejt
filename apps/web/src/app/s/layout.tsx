import { Inter } from 'next/font/google';
import '../globals.css';
import { PublishedSiteProviders } from './providers';

const inter = Inter({ subsets: ['latin'] });

/**
 * Layout for published sites (/s/[slug]).
 * Uses minimal providers without NextAuth SessionProvider.
 */
export default function PublishedSiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="de" suppressHydrationWarning>
      <body className={inter.className}>
        <PublishedSiteProviders>{children}</PublishedSiteProviders>
      </body>
    </html>
  );
}
