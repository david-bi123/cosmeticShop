'use client';
import * as React from 'react';
import { Heart, ShoppingBag, Star, Truck, ShieldCheck, RotateCcw, Minus, Plus } from 'lucide-react';
import { useStore } from './store-provider';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { formatPrice, cn, imageUrl, type ImageInput } from '@/lib/utils';

interface VariantOption { label: string; values: string[] }
interface Review { name: string; rating: number; comment: string; createdAt: string | Date }

interface Props {
  product: {
    _id: string;
    name: string;
    slug: string;
    price: number;
    discountPrice?: number;
    sku: string;
    stock: number;
    description?: string;
    images: ImageInput[];
    brand?: { name: string };
    rating?: number;
    ratingCount?: number;
    sizes?: string[];
    colors?: string[];
    shades?: string[];
    expiryDate?: string;
    manufactureDate?: string;
  };
  reviews: Review[];
  canReview: boolean;
}

export function ProductDetail({ product, reviews, canReview }: Props) {
  const { addToCart, toggleWishlist, inWishlist } = useStore();
  const [qty, setQty] = React.useState(1);
  const [variant, setVariant] = React.useState<{ size?: string; color?: string; shade?: string }>({});

  const options: VariantOption[] = [
    { label: 'Size', values: product.sizes || [] },
    { label: 'Color', values: product.colors || [] },
    { label: 'Shade', values: product.shades || [] },
  ].filter((o) => o.values.length > 0);

  const price = product.discountPrice || product.price;
  const wished = inWishlist(product._id);

  return (
    <div>
        {product.brand && <p className="text-sm uppercase tracking-wide text-muted-foreground">{product.brand.name}</p>}
        <h1 className="mt-1 text-3xl font-bold">{product.name}</h1>
        <div className="mt-2 flex items-center gap-2 text-sm">
          <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star key={s} className={cn('h-4 w-4', s <= Math.round(product.rating || 0) ? 'fill-gold text-gold' : 'text-muted-foreground')} />
            ))}
          </div>
          <span className="text-muted-foreground">{product.rating?.toFixed(1) || '0.0'} ({product.ratingCount || 0} reviews)</span>
        </div>
        <div className="mt-4 flex items-center gap-3">
          {product.discountPrice ? (
            <>
              <span className="text-3xl font-bold text-destructive">{formatPrice(product.discountPrice)}</span>
              <span className="text-lg text-muted-foreground line-through">{formatPrice(product.price)}</span>
              <Badge variant="destructive">Sale</Badge>
            </>
          ) : (
            <span className="text-3xl font-bold">{formatPrice(product.price)}</span>
          )}
        </div>

        {options.map((opt) => (
          <div key={opt.label} className="mt-5">
            <p className="text-sm font-medium">{opt.label}</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {opt.values.map((v) => (
                <button
                  key={v}
                  onClick={() => setVariant((prev) => ({ ...prev, [opt.label.toLowerCase()]: v }))}
                  className={cn('rounded-full border px-3 py-1 text-sm transition', variant[opt.label.toLowerCase() as keyof typeof variant] === v ? 'border-primary bg-primary/10 text-primary' : 'border-white/40 bg-white/50 hover:bg-white/80 dark:bg-white/5')}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>
        ))}

        <div className="mt-5 flex items-center gap-3">
          <div className="flex items-center rounded-full border border-white/40 bg-white/50 dark:bg-white/5">
            <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-accent/10"><Minus className="h-4 w-4" /></button>
            <span className="w-8 text-center font-medium">{qty}</span>
            <button onClick={() => setQty((q) => Math.min(product.stock, q + 1))} className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-accent/10"><Plus className="h-4 w-4" /></button>
          </div>
          <Button
            size="lg"
            className="flex-1 rounded-full"
            disabled={product.stock <= 0}
            onClick={() => addToCart({ productId: product._id, name: product.name, slug: product.slug, image: imageUrl(product.images[0]), price, quantity: qty, variant, stock: product.stock, sku: product.sku })}
          >
            <ShoppingBag className="h-4 w-4" /> {product.stock <= 0 ? 'Out of Stock' : 'Add to Cart'}
          </Button>
          <Button size="lg" variant="outline" className="rounded-full" onClick={() => toggleWishlist(product._id)}>
            <Heart className={cn('h-4 w-4', wished && 'fill-primary text-primary')} />
          </Button>
        </div>

        {product.stock > 0 && product.stock <= 10 && (
          <p className="mt-2 text-sm font-medium text-amber-600">Only {product.stock} left in stock!</p>
        )}

        <div className="mt-5 grid grid-cols-3 gap-2 text-xs text-muted-foreground">
          <div className="flex items-center gap-1"><Truck className="h-4 w-4 text-primary" /> Fast Delivery</div>
          <div className="flex items-center gap-1"><ShieldCheck className="h-4 w-4 text-primary" /> Authentic</div>
          <div className="flex items-center gap-1"><RotateCcw className="h-4 w-4 text-primary" /> 14-day Returns</div>
        </div>

        <Separator className="my-5" />

        <Tabs defaultValue="description">
          <TabsList className="w-full">
            <TabsTrigger value="description" className="flex-1">Description</TabsTrigger>
            <TabsTrigger value="reviews" className="flex-1">Reviews ({reviews.length})</TabsTrigger>
            <TabsTrigger value="info" className="flex-1">Details</TabsTrigger>
          </TabsList>
          <TabsContent value="description">
            <p className="text-sm leading-relaxed text-muted-foreground">{product.description || 'No description available.'}</p>
          </TabsContent>
          <TabsContent value="reviews">
            <ReviewsSection reviews={reviews} canReview={canReview} productId={product._id} />
          </TabsContent>
          <TabsContent value="info">
            <dl className="space-y-1 text-sm">
              <div className="flex justify-between"><dt className="text-muted-foreground">SKU</dt><dd>{product.sku}</dd></div>
              {product.manufactureDate && <div className="flex justify-between"><dt className="text-muted-foreground">Manufactured</dt><dd>{new Date(product.manufactureDate).toLocaleDateString()}</dd></div>}
              {product.expiryDate && <div className="flex justify-between"><dt className="text-muted-foreground">Expires</dt><dd>{new Date(product.expiryDate).toLocaleDateString()}</dd></div>}
            </dl>
          </TabsContent>
        </Tabs>
      </div>
  );
}

function ReviewsSection({ reviews, canReview, productId }: { reviews: Review[]; canReview: boolean; productId: string }) {
  const [rating, setRating] = React.useState(5);
  const [comment, setComment] = React.useState('');
  const [msg, setMsg] = React.useState('');
  const [busy, setBusy] = React.useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const fd = new FormData();
    fd.set('rating', String(rating));
    fd.set('comment', comment);
    const res = await fetch(`/api/products/${productId}/review`, { method: 'POST', body: fd });
    const data = await res.json();
    setBusy(false);
    if (data.success) { setMsg('Thank you for your review!'); setComment(''); }
    else setMsg(data.error || 'Failed to submit');
  };

  return (
    <div className="space-y-4">
      {canReview && (
        <form onSubmit={submit} className="glass-card rounded-xl p-4">
          <p className="text-sm font-medium">Write a review</p>
          <div className="mt-2 flex gap-1">
            {[1, 2, 3, 4, 5].map((s) => (
              <button type="button" key={s} onClick={() => setRating(s)}>
                <Star className={cn('h-5 w-5', s <= rating ? 'fill-gold text-gold' : 'text-muted-foreground')} />
              </button>
            ))}
          </div>
          <textarea value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Share your experience..." className="mt-2 min-h-[80px] w-full rounded-lg border border-input bg-background/60 p-2 text-sm" />
          <Button type="submit" size="sm" disabled={busy} className="mt-2">{busy ? 'Submitting...' : 'Submit Review'}</Button>
          {msg && <p className="mt-2 text-sm text-primary">{msg}</p>}
        </form>
      )}
      {reviews.length === 0 ? (
        <p className="text-sm text-muted-foreground">No reviews yet. Be the first!</p>
      ) : (
        reviews.map((r, i) => (
          <div key={i} className="glass-card rounded-xl p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold">{r.name}</p>
              <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className={cn('h-3 w-3', s <= r.rating ? 'fill-gold text-gold' : 'text-muted-foreground')} />
                ))}
              </div>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">{r.comment}</p>
            <p className="mt-1 text-xs text-muted-foreground">{new Date(r.createdAt).toLocaleDateString()}</p>
          </div>
        ))
      )}
    </div>
  );
}
