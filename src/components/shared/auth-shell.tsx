import Link from 'next/link';
import Image from 'next/image';
import { Sparkles } from 'lucide-react';

export function AuthShell({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <div className="relative hidden w-1/2 overflow-hidden lg:block">
        <Image src="https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=1000&q=80" alt="Beauty" fill className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/60 to-gold/40 mix-blend-multiply" />
        <div className="absolute inset-0 flex flex-col justify-between p-12 text-white">
          <Link href="/" className="flex items-center gap-2 text-2xl font-bold"><span>✦</span> Lumière</Link>
          <div>
            <h2 className="text-4xl font-bold leading-tight">Beauty, delivered with elegance.</h2>
            <p className="mt-3 max-w-md opacity-90">Join thousands of Ghanaian beauties shopping premium cosmetics, skincare and fragrances.</p>
          </div>
        </div>
      </div>
      <div className="flex w-full flex-col justify-center bg-cream-50 px-6 py-12 dark:bg-background lg:w-1/2">
        <Link href="/" className="mb-8 flex items-center justify-center gap-2 text-2xl font-bold lg:hidden"><Sparkles className="h-6 w-6 text-primary" /> Lumière</Link>
        <div className="mx-auto w-full max-w-sm">
          <h1 className="text-3xl font-bold">{title}</h1>
          <p className="mt-1 text-muted-foreground">{subtitle}</p>
          <div className="mt-8">{children}</div>
        </div>
      </div>
    </div>
  );
}
