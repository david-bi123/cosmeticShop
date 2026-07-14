'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Package, Boxes, ShoppingCart, Users, UserCog, Ticket, FileBarChart, ScrollText, LogOut, Menu } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

const links = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/products', label: 'Products', icon: Package },
  { href: '/admin/inventory', label: 'Inventory', icon: Boxes },
  { href: '/admin/orders', label: 'Orders', icon: ShoppingCart },
  { href: '/admin/customers', label: 'Customers', icon: Users },
  { href: '/admin/employees', label: 'Employees', icon: UserCog },
  { href: '/admin/coupons', label: 'Coupons', icon: Ticket },
  { href: '/admin/reports', label: 'Reports', icon: FileBarChart },
  { href: '/admin/audit', label: 'Audit Logs', icon: ScrollText },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) => (href === '/admin' ? pathname === '/admin' : pathname.startsWith(href));

  return (
    <>
      <button className="fixed left-4 top-4 z-50 flex h-10 w-10 items-center justify-center rounded-full border border-white/40 bg-white/70 shadow lg:hidden dark:bg-white/10" onClick={() => setOpen(!open)} aria-label="Menu">
        <Menu className="h-5 w-5" />
      </button>
      <aside className={cn('fixed inset-y-0 left-0 z-40 w-64 transform border-r border-white/30 bg-cream-100/90 backdrop-blur-xl transition-transform dark:bg-card/80 lg:translate-x-0', open ? 'translate-x-0' : '-translate-x-full')}>
        <div className="flex h-16 items-center gap-2 border-b border-white/30 px-6">
          <span className="text-2xl">✦</span>
          <span className="luxe-gradient-text text-xl font-bold">Lumière Admin</span>
        </div>
        <nav className="space-y-1 p-3">
          {links.map((l) => (
            <Link key={l.href} href={l.href} onClick={() => setOpen(false)} className={cn('flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition', isActive(l.href) ? 'bg-primary text-primary-foreground shadow-luxe' : 'text-foreground/80 hover:bg-accent/10')}>
              <l.icon className="h-4 w-4" /> {l.label}
            </Link>
          ))}
        </nav>
        <div className="absolute bottom-4 left-3 right-3 space-y-1">
          <Link href="/" className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-foreground/80 transition hover:bg-accent/10"><Package className="h-4 w-4" /> View Store</Link>
          <form action="/api/auth/logout" method="post">
            <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-destructive transition hover:bg-destructive/10"><LogOut className="h-4 w-4" /> Logout</button>
          </form>
        </div>
      </aside>
    </>
  );
}
