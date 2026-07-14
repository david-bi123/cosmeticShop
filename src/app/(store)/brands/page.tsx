import Link from 'next/link';
import { getBrands } from '@/actions/catalog';

export const metadata = { title: 'Brands | Lumière Beauty' };

export default async function BrandsPage() {
  const brands = await getBrands();
  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold">Brands</h1>
      <p className="text-muted-foreground">Shop from the world's best beauty houses</p>
      <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {brands.map((b: any) => (
          <Link key={b._id} href={`/products?brand=${b.slug}`} className="flex h-32 flex-col items-center justify-center gap-1 rounded-2xl border border-white/40 bg-white/60 text-center shadow-glass transition hover:shadow-luxe dark:bg-white/5">
            <span className="text-lg font-bold">{b.name}</span>
            {b.country && <span className="text-xs text-muted-foreground">{b.country}</span>}
          </Link>
        ))}
      </div>
    </div>
  );
}
