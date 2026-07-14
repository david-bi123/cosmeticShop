import { getProducts, getCategories, getBrands } from '@/actions/catalog';
import { ProductCard } from '@/components/shared/product-card';
import { ProductFilters } from '@/components/shared/product-filters';
import { Skeleton } from '@/components/ui/skeleton';

export const metadata = { title: 'Shop All Products | Lumière Beauty' };

const SORTS = [
  { value: '', label: 'Latest' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Top Rated' },
  { value: 'popular', label: 'Most Viewed' },
];

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const sp = await searchParams;
  const category = sp.category ? decodeURIComponent(sp.category) : undefined;
  const brand = sp.brand ? decodeURIComponent(sp.brand) : undefined;

  const [categoryDocs, brandDocs] = await Promise.all([getCategories(), getBrands()]);
  const cat = category ? categoryDocs.find((c) => c.slug === category) : null;
  const br = brand ? brandDocs.find((b) => b.slug === brand) : null;

  const { products, total, totalPages, page } = await getProducts({
    category: cat?._id.toString(),
    brand: br?._id.toString(),
    search: sp.q,
    featured: sp.featured === '1',
    bestSeller: sp.best === '1',
    newArrival: sp.new === '1',
    minPrice: sp.min ? Number(sp.min) : undefined,
    maxPrice: sp.max ? Number(sp.max) : undefined,
    sort: sp.sort,
    page: sp.page ? Number(sp.page) : 1,
  });

  return (
    <div className="container py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">{cat ? cat.name : br ? br.name : sp.q ? `Results for "${sp.q}"` : 'All Products'}</h1>
        <p className="text-muted-foreground">{total} products</p>
      </div>
      <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
        <ProductFilters categories={categoryDocs} brands={brandDocs} current={{ category, brand, sort: sp.sort, min: sp.min, max: sp.max }} />
        <div>
          {products.length === 0 ? (
            <div className="glass-card flex h-60 items-center justify-center text-muted-foreground">No products found.</div>
          ) : (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
              {products.map((p, i) => (
                <ProductCard key={p._id.toString()} product={p as any} index={i} />
              ))}
            </div>
          )}
          {totalPages > 1 && (
            <div className="mt-8 flex justify-center gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => {
                const params = new URLSearchParams(sp as any);
                params.set('page', String(p));
                return (
                  <a key={p} href={`/products?${params.toString()}`} className={`flex h-9 min-w-9 items-center justify-center rounded-lg border px-3 text-sm ${p === page ? 'border-primary bg-primary text-primary-foreground' : 'border-white/40 bg-white/50'}`}>
                    {p}
                  </a>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
