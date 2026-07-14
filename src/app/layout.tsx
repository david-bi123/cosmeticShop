import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/components/shared/theme-provider';
import { StoreProvider } from '@/components/shared/store-provider';
import { Toaster } from '@/components/ui/sonner';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Lumière Beauty | Premium Cosmetics Shop',
  description:
    'Discover luxury cosmetics, skincare and beauty essentials at Lumière Beauty. Premium cosmetics shop management system.',
  keywords: ['cosmetics', 'beauty', 'skincare', 'Ghana', 'makeup', 'shop'],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <StoreProvider>
            {children}
            <Toaster />
          </StoreProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
