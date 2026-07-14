'use client';
import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, ShoppingBag, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { useStore } from './store-provider';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatPrice, cn, imageUrl, type ImageInput } from '@/lib/utils';

interface Product {
  _id: string;
  name: string;
  slug: string;
  price: number;
  discountPrice?: number;
  images: ImageInput[];
  rating?: number;
  ratingCount?: number;
  stock: number;
  isBestSeller?: boolean;
  isNewArrival?: boolean;
  sku: string;
  brand?: { name: string; slug: string };
}

export function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  const { addToCart, toggleWishlist, inWishlist } = useStore();
  const wished = inWishlist(product._id);
  const image = imageUrl(product.images?.[0]) || 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&q=80';
  const discount = product.discountPrice ? Math.round((1 - product.discountPrice / product.price) * 100) : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.04, 0.3) }}
      className="group relative overflow-hidden rounded-2xl border border-white/40 bg-white/60 p-3 shadow-glass backdrop-blur-xl transition-all hover:shadow-luxe dark:bg-white/5"
    >
      <div className="relative aspect-square overflow-hidden rounded-xl bg-cream-100 dark:bg-secondary/40">
        <Link href={`/products/${product.slug}`}>
          <Image src={image} alt={product.name} fill className="object-cover transition-transform duration-500 group-hover:scale-110" sizes="(max-width:768px) 50vw, 25vw" />
        </Link>
        <div className="absolute left-2 top-2 flex flex-col gap-1">
          {product.isNewArrival && <Badge variant="gold">New</Badge>}
          {product.isBestSeller && <Badge variant="secondary">Best Seller</Badge>}
          {discount > 0 && <Badge variant="destructive">-{discount}%</Badge>}
        </div>
        <button
          onClick={() => toggleWishlist(product._id)}
          className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full border border-white/40 bg-white/70 backdrop-blur transition hover:bg-white"
          aria-label="Wishlist"
        >
          <Heart className={cn('h-4 w-4', wished ? 'fill-primary text-primary' : 'text-foreground')} />
        </button>
      </div>
      <div className="mt-3 px-1">
        {product.brand && <p className="text-xs uppercase tracking-wide text-muted-foreground">{product.brand.name}</p>}
        <Link href={`/products/${product.slug}`} className="line-clamp-2 min-h-[2.5rem] font-medium leading-snug transition hover:text-primary">
          {product.name}
        </Link>
        <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
          <Star className="h-3 w-3 fill-gold text-gold" />
          <span>{product.rating?.toFixed(1) || '0.0'}</span>
          <span>({product.ratingCount || 0})</span>
        </div>
        <div className="mt-2 flex items-center justify-between">
          <div className="flex flex-col">
            {product.discountPrice ? (
              <>
                <span className="text-sm font-semibold text-destructive">{formatPrice(product.discountPrice)}</span>
                <span className="text-xs text-muted-foreground line-through">{formatPrice(product.price)}</span>
              </>
            ) : (
              <span className="font-semibold">{formatPrice(product.price)}</span>
            )}
          </div>
          <Button
            size="icon"
            disabled={product.stock <= 0}
            onClick={() =>
              addToCart({
                productId: product._id,
                name: product.name,
                slug: product.slug,
                image,
                price: product.discountPrice || product.price,
                quantity: 1,
                stock: product.stock,
                sku: product.sku,
              })
            }
            className="h-9 w-9 rounded-full"
            aria-label="Add to cart"
          >
            <ShoppingBag className="h-4 w-4" />
          </Button>
        </div>
        {product.stock <= 0 && <p className="mt-1 text-xs font-medium text-destructive">Out of stock</p>}
      </div>
    </motion.div>
  );
}
