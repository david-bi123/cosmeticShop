import Link from 'next/link';
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from 'lucide-react';

export function Footer() {
  return (
    <footer className="mt-16 border-t border-white/30 bg-cream-100/60 dark:bg-card/40 backdrop-blur-xl">
      <div className="container grid gap-8 py-12 md:grid-cols-4">
        <div>
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl">✦</span>
            <span className="luxe-gradient-text text-xl font-bold">Lumière</span>
          </Link>
          <p className="mt-3 max-w-xs text-sm text-muted-foreground">
            Premium beauty, skincare and cosmetics delivered across Ghana. Curated luxury for every skin.
          </p>
          <div className="mt-4 flex gap-2">
            {[Instagram, Facebook, Twitter].map((Icon, i) => (
              <a key={i} href="#" className="flex h-9 w-9 items-center justify-center rounded-full border border-white/40 bg-white/50 transition hover:bg-white/80 dark:bg-white/5">
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>
        <div>
          <h4 className="text-sm font-semibold">Shop</h4>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li><Link href="/products" className="hover:text-foreground">All Products</Link></li>
            <li><Link href="/products?sort=new" className="hover:text-foreground">New Arrivals</Link></li>
            <li><Link href="/products?best=1" className="hover:text-foreground">Best Sellers</Link></li>
            <li><Link href="/brands" className="hover:text-foreground">Brands</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold">Account</h4>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li><Link href="/account" className="hover:text-foreground">My Account</Link></li>
            <li><Link href="/account/orders" className="hover:text-foreground">My Orders</Link></li>
            <li><Link href="/wishlist" className="hover:text-foreground">Wishlist</Link></li>
            <li><Link href="/cart" className="hover:text-foreground">Cart</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold">Contact</h4>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li className="flex items-center gap-2"><MapPin className="h-4 w-4" /> Accra Mall, Ghana</li>
            <li className="flex items-center gap-2"><Phone className="h-4 w-4" /> +233 20 123 4567</li>
            <li className="flex items-center gap-2"><Mail className="h-4 w-4" /> hello@lumiere.gh</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/30 py-5">
        <p className="container text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} Lumière Beauty. All rights reserved. Crafted with elegance in Ghana.
        </p>
      </div>
    </footer>
  );
}
