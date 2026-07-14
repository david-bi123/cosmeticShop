'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { User, Package, MapPin, Heart, KeyRound, LayoutDashboard } from 'lucide-react';
import { cn } from '@/lib/utils';

const links = [
  { href: '/account', label: 'Overview', icon: User },
  { href: '/account/orders', label: 'My Orders', icon: Package },
  { href: '/account/addresses', label: 'Addresses', icon: MapPin },
  { href: '/wishlist', label: 'Wishlist', icon: Heart },
  { href: '/account/security', label: 'Security', icon: KeyRound },
];

export function AccountSidebar({ role }: { role: string }) {
  const pathname = usePathname();
  return (
    <nav className="glass-card space-y-1 rounded-xl p-3">
      {links.map((l) => {
        const active = pathname === l.href;
        return (
          <Link key={l.href} href={l.href} className={cn('flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition', active ? 'bg-primary text-primary-foreground' : 'hover:bg-accent/10')}>
            <l.icon className="h-4 w-4" /> {l.label}
          </Link>
        );
      })}
      {(role === 'admin' || role === 'super_admin' || role === 'staff') && (
        <Link href="/admin" className={cn('flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition', pathname.startsWith('/admin') ? 'bg-primary text-primary-foreground' : 'hover:bg-accent/10')}>
          <LayoutDashboard className="h-4 w-4" /> Dashboard
        </Link>
      )}
    </nav>
  );
}
