import Image from 'next/image';
import Link from 'next/link';
import { getCategories } from '@/actions/catalog';

export const metadata = { title: 'Categories | Lumière Beauty' };

export default async function CategoriesPage() {
  const categories = await getCategories();
  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold">Categories</h1>
      <p className="text-muted-foreground">Browse by your favorite beauty category</p>
      <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {categories.map((c: any) => (
          <Link key={c._id} href={`/products?category=${c.slug}`} className="group overflow-hidden rounded-2xl border border-white/40 bg-white/60 shadow-glass transition hover:shadow-luxe dark:bg-white/5">
            <div className="relative aspect-square">
              {c.image ? <Image src={c.image} alt={c.name} fill className="object-cover transition group-hover:scale-110" sizes="250px" /> : <div className="flex h-full items-center justify-center bg-gradient-luxe text-4xl text-white">✦</div>}
            </div>
            <p className="py-4 text-center font-medium">{c.name}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
