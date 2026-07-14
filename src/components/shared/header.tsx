'use client';
import * as React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Heart, Menu, Search, ShoppingBag, User, Sun, X } from 'lucide-react';
import { useStore } from './store-provider';
import { useTheme } from './theme-provider';
import { ThemeToggle } from './theme-toggle';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface HeaderProps {
  categories: { _id: string; name: string; slug: string }[];
  user?: { name: string; role: string } | null;
}

export function Header({ categories, user }: HeaderProps) {
  const { cartCount, wishlist } = useStore();
  const { theme } = useTheme();
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState('');
  const [accountOpen, setAccountOpen] = React.useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) router.push(`/search?q=${encodeURIComponent(search.trim())}`);
  };

  return (
    <header className="sticky top-0 z-40 border-b border-white/30 bg-cream-50/80 backdrop-blur-xl dark:bg-background/80">
      <div className="container flex h-16 items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <button className="md:hidden" onClick={() => setOpen(!open)} aria-label="Menu">
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl">✦</span>
            <span className="luxe-gradient-text text-xl font-bold tracking-tight">Lumière</span>
          </Link>
        </div>

        <nav className="hidden items-center gap-1 md:flex">
          {categories.slice(0, 6).map((c) => (
            <Link
              key={c._id}
              href={`/products?category=${c.slug}`}
              className="rounded-lg px-3 py-2 text-sm font-medium text-foreground/80 transition hover:bg-accent/10 hover:text-foreground"
            >
              {c.name}
            </Link>
          ))}
          <Link href="/products" className="rounded-lg px-3 py-2 text-sm font-medium text-foreground/80 transition hover:bg-accent/10 hover:text-foreground">
            All
          </Link>
        </nav>

        <div className="flex items-center gap-1.5">
          <form onSubmit={submitSearch} className="hidden items-center lg:flex">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search beauty..."
                className="w-48 rounded-full pl-9 focus-visible:w-64"
              />
            </div>
          </form>
          <ThemeToggle />
          <Link href="/wishlist" className="relative flex h-9 w-9 items-center justify-center rounded-full border border-white/40 bg-white/50 transition hover:bg-white/80 dark:bg-white/5" aria-label="Wishlist">
            <Heart className="h-4 w-4" />
            {wishlist.length > 0 && <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">{wishlist.length}</span>}
          </Link>
          <Link href="/cart" className="relative flex h-9 w-9 items-center justify-center rounded-full border border-white/40 bg-white/50 transition hover:bg-white/80 dark:bg-white/5" aria-label="Cart">
            <ShoppingBag className="h-4 w-4" />
            {cartCount > 0 && <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">{cartCount}</span>}
          </Link>
          <div className="relative">
            <button
              onClick={() => setAccountOpen(!accountOpen)}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/40 bg-white/50 transition hover:bg-white/80 dark:bg-white/5"
              aria-label="Account"
            >
              <User className="h-4 w-4" />
            </button>
            {accountOpen && (
              <div
                className="absolute right-0 top-11 w-48 overflow-hidden rounded-xl border border-white/40 bg-card p-1 shadow-luxe"
                onMouseLeave={() => setAccountOpen(false)}
              >
                {user ? (
                  <>
                    <div className="px-3 py-2 text-sm">
                      <p className="font-semibold">{user.name}</p>
                      <p className="text-xs capitalize text-muted-foreground">{user.role.replace('_', ' ')}</p>
                    </div>
                    <Link href="/account" className="block rounded-lg px-3 py-2 text-sm hover:bg-accent/10">My Account</Link>
                    <Link href="/account/orders" className="block rounded-lg px-3 py-2 text-sm hover:bg-accent/10">My Orders</Link>
                    {user.role !== 'customer' && (
                      <Link href="/admin" className="block rounded-lg px-3 py-2 text-sm hover:bg-accent/10">Dashboard</Link>
                    )}
                    <form action="/api/auth/logout" method="post">
                      <button className="block w-full rounded-lg px-3 py-2 text-left text-sm text-destructive hover:bg-destructive/10">Logout</button>
                    </form>
                  </>
                ) : (
                  <>
                    <Link href="/login" className="block rounded-lg px-3 py-2 text-sm hover:bg-accent/10">Login</Link>
                    <Link href="/register" className="block rounded-lg px-3 py-2 text-sm hover:bg-accent/10">Create Account</Link>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {open && (
        <div className="border-t border-white/30 bg-cream-50/95 pb-4 pt-2 backdrop-blur-xl dark:bg-background/95 md:hidden">
          <div className="container space-y-1">
            <form onSubmit={submitSearch} className="mb-2 flex lg:hidden">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search beauty..." className="w-full rounded-full pl-9" />
              </div>
            </form>
            {categories.map((c) => (
              <Link key={c._id} href={`/products?category=${c.slug}`} onClick={() => setOpen(false)} className="block rounded-lg px-3 py-2 text-sm hover:bg-accent/10">
                {c.name}
              </Link>
            ))}
            <Link href="/products" onClick={() => setOpen(false)} className="block rounded-lg px-3 py-2 text-sm font-semibold hover:bg-accent/10">
              View All Products
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
