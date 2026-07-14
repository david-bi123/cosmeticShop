'use client';
import * as React from 'react';
import Link from 'next/link';
import { Heart } from 'lucide-react';
import { useStore } from './store-provider';
import { ProductCard } from './product-card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';

export function WishlistView() {
  const { wishlist } = useStore();
  const [products, setProducts] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (!wishlist.length) { setProducts([]); setLoading(false); return; }
    setLoading(true);
    fetch(`/api/products/batch?ids=${wishlist.join(',')}`)
      .then((r) => r.json())
      .then((d) => { setProducts(d.products || []); setLoading(false); });
  }, [wishlist]);

  if (!wishlist.length) {
    return (
      <div className="container flex flex-col items-center justify-center py-24 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gold/15 text-gold-dark dark:text-gold-light"><Heart className="h-9 w-9" /></div>
        <h1 className="mt-4 text-2xl font-bold">Your wishlist is empty</h1>
        <Button asChild className="mt-6 rounded-full"><Link href="/products">Browse Products</Link></Button>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold">My Wishlist</h1>
      <p className="text-muted-foreground">{wishlist.length} saved item(s)</p>
      <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {loading ? Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="aspect-[3/4] rounded-2xl" />) : products.map((p, i) => <ProductCard key={p._id} product={p} index={i} />)}
      </div>
    </div>
  );
}
