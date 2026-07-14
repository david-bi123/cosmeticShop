import { notFound } from 'next/navigation';
import { getProductBySlug, getRelatedProducts, getProductById } from '@/actions/catalog';
import { dbConnect } from '@/lib/db';
import { Product } from '@/models/Product';
import { getCurrentUser } from '@/lib/session';
import { ProductGallery } from '@/components/shared/product-gallery';
import { ProductDetail } from '@/components/shared/product-detail';
import { ProductCard } from '@/components/shared/product-card';
import { TrackRecentlyViewed } from '@/components/shared/track-recent';
import { Reveal, Stagger, StaggerItem } from '@/components/shared/reveal';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  return { title: product ? `${product.name} | Lumière Beauty` : 'Product | Lumière Beauty' };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  await dbConnect();
  await Product.updateOne({ _id: product._id }, { $inc: { views: 1 } });

  const user = await getCurrentUser();
  const related = await getRelatedProducts(product._id.toString(), (product.category as any)._id.toString());

  const reviews = (product.reviews || []).map((r: any) => ({
    name: r.name,
    rating: r.rating,
    comment: r.comment,
    createdAt: r.createdAt,
  }));

  return (
    <div className="container py-8">
      <TrackRecentlyViewed productId={product._id.toString()} />
      <div className="grid gap-8 lg:grid-cols-2">
        <ProductGallery images={product.images} name={product.name} />
        <ProductDetail
          product={{
            _id: product._id.toString(),
            name: product.name,
            slug: product.slug,
            price: product.price,
            discountPrice: product.discountPrice,
            sku: product.sku,
            stock: product.stock,
            description: product.description,
            images: product.images,
            brand: product.brand as any,
            rating: product.rating,
            ratingCount: product.ratingCount,
            sizes: product.sizes,
            colors: product.colors,
            shades: product.shades,
            expiryDate: product.expiryDate ? product.expiryDate.toISOString() : undefined,
            manufactureDate: product.manufactureDate ? product.manufactureDate.toISOString() : undefined,
          }}
          reviews={reviews}
          canReview={!!user}
        />
      </div>

      {related.length > 0 && (
        <section className="mt-16">
          <Reveal><h2 className="text-2xl font-bold">You may also like</h2></Reveal>
          <Stagger className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
            {related.map((p, i) => (
              <StaggerItem key={(p as any)._id.toString()}><ProductCard product={p as any} index={i} /></StaggerItem>
            ))}
          </Stagger>
        </section>
      )}
    </div>
  );
}
