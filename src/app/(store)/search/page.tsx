import { getProducts } from '@/actions/catalog';
import { ProductCard } from '@/components/shared/product-card';

export const metadata = { title: 'Search | Lumière Beauty' };

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q } = await searchParams;
  const { products, total } = await getProducts({ search: q, pageSize: 48 });
  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold">Search</h1>
      <p className="text-muted-foreground">{total} result(s) for "{q}"</p>
      <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {products.map((p, i) => <ProductCard key={p._id.toString()} product={p as any} index={i} />)}
      </div>
      {products.length === 0 && <div className="glass-card mt-6 flex h-60 items-center justify-center text-muted-foreground">No products found.</div>}
    </div>
  );
}
