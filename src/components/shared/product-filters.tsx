'use client';
import * as React from 'react';
import { useRouter } from 'next/navigation';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface Props {
  categories: { _id: string; name: string; slug: string }[];
  brands: { _id: string; name: string; slug: string }[];
  current: { category?: string; brand?: string; sort?: string; min?: string; max?: string };
}

export function ProductFilters({ categories, brands, current }: Props) {
  const router = useRouter();
  const [cat, setCat] = React.useState(current.category || '');
  const [br, setBr] = React.useState(current.brand || '');
  const [min, setMin] = React.useState(current.min || '');
  const [max, setMax] = React.useState(current.max || '');

  const apply = () => {
    const params = new URLSearchParams();
    if (cat) params.set('category', cat);
    if (br) params.set('brand', br);
    if (min) params.set('min', min);
    if (max) params.set('max', max);
    router.push(`/products?${params.toString()}`);
  };

  const setParam = (key: string, value: string) => {
    const params = new URLSearchParams(window.location.search);
    if (value) params.set(key, value);
    else params.delete(key);
    params.delete('page');
    router.push(`/products?${params.toString()}`);
  };

  return (
    <aside className="space-y-6">
      <div className="glass-card rounded-xl p-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">Filters</h3>
          <button className="text-xs text-muted-foreground hover:text-foreground" onClick={() => { setCat(''); setBr(''); setMin(''); setMax(''); router.push('/products'); }}>
            Clear all
          </button>
        </div>

        <div className="mt-4">
          <Label className="text-xs">Category</Label>
          <select value={cat} onChange={(e) => { setCat(e.target.value); }} className="mt-1 h-9 w-full rounded-lg border border-input bg-background/60 px-2 text-sm">
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c._id} value={c.slug}>{c.name}</option>
            ))}
          </select>
        </div>

        <div className="mt-3">
          <Label className="text-xs">Brand</Label>
          <select value={br} onChange={(e) => setBr(e.target.value)} className="mt-1 h-9 w-full rounded-lg border border-input bg-background/60 px-2 text-sm">
            <option value="">All Brands</option>
            {brands.map((b) => (
              <option key={b._id} value={b.slug}>{b.name}</option>
            ))}
          </select>
        </div>

        <div className="mt-3">
          <Label className="text-xs">Price Range (GHS)</Label>
          <div className="mt-1 flex items-center gap-2">
            <Input type="number" placeholder="Min" value={min} onChange={(e) => setMin(e.target.value)} className="h-9" />
            <span className="text-muted-foreground">-</span>
            <Input type="number" placeholder="Max" value={max} onChange={(e) => setMax(e.target.value)} className="h-9" />
          </div>
        </div>

        <Button onClick={apply} className="mt-4 w-full rounded-lg">Apply Filters</Button>
      </div>

      <div className="glass-card rounded-xl p-4">
        <Label className="text-xs">Sort By</Label>
        <select value={current.sort || ''} onChange={(e) => setParam('sort', e.target.value)} className="mt-1 h-9 w-full rounded-lg border border-input bg-background/60 px-2 text-sm">
          <option value="">Latest</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
          <option value="rating">Top Rated</option>
          <option value="popular">Most Viewed</option>
        </select>
      </div>
    </aside>
  );
}
