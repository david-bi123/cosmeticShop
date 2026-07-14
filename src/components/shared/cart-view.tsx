'use client';
import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Minus, Plus, Trash2, ShoppingBag, Tag } from 'lucide-react';
import { useStore } from './store-provider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { formatPrice, cn } from '@/lib/utils';

export function CartView() {
  const { cart, updateQty, removeFromCart, clearCart } = useStore();
  const [coupon, setCoupon] = React.useState('');
  const [discount, setDiscount] = React.useState(0);
  const [couponMsg, setCouponMsg] = React.useState('');

  const subtotal = cart.reduce((a, b) => a + b.price * b.quantity, 0);
  const shipping = subtotal > 300 ? 0 : cart.length ? 25 : 0;
  const total = subtotal - discount + shipping;

  const applyCoupon = async () => {
    if (!coupon) return;
    const res = await fetch(`/api/coupons/validate?code=${encodeURIComponent(coupon)}&total=${subtotal}`);
    const data = await res.json();
    if (data.valid) { setDiscount(data.discount); setCouponMsg(`Applied: ${data.code} (-${formatPrice(data.discount)})`); }
    else { setDiscount(0); setCouponMsg(data.error || 'Invalid coupon'); }
  };

  if (cart.length === 0) {
    return (
      <div className="container flex flex-col items-center justify-center py-24 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gold/15 text-gold-dark dark:text-gold-light"><ShoppingBag className="h-9 w-9" /></div>
        <h1 className="mt-4 text-2xl font-bold">Your cart is empty</h1>
        <p className="mt-2 text-muted-foreground">Looks like you haven't added anything yet.</p>
        <Button asChild className="mt-6 rounded-full"><Link href="/products">Start Shopping</Link></Button>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold">Shopping Cart</h1>
      <p className="text-muted-foreground">{cart.length} item(s)</p>
      <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_360px]">
        <div className="space-y-3">
          {cart.map((item) => (
            <div key={item.productId + JSON.stringify(item.variant)} className="glass-card flex gap-4 rounded-xl p-4">
              <Link href={`/products/${item.slug}`} className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg bg-cream-100 dark:bg-secondary/40">
                <Image src={item.image} alt={item.name} fill className="object-cover" sizes="96px" />
              </Link>
              <div className="flex flex-1 flex-col">
                <Link href={`/products/${item.slug}`} className="font-medium hover:text-primary">{item.name}</Link>
                {item.variant && <p className="text-xs text-muted-foreground">{Object.entries(item.variant).filter(([, v]) => v).map(([k, v]) => `${k}: ${v}`).join(', ')}</p>}
                <p className="mt-1 text-sm font-semibold">{formatPrice(item.price)}</p>
                <div className="mt-auto flex items-center justify-between">
                  <div className="flex items-center rounded-full border border-white/40 bg-white/50 dark:bg-white/5">
                    <button onClick={() => updateQty(item.productId, item.quantity - 1)} className="flex h-8 w-8 items-center justify-center"><Minus className="h-3 w-3" /></button>
                    <span className="w-7 text-center text-sm">{item.quantity}</span>
                    <button onClick={() => updateQty(item.productId, item.quantity + 1)} className="flex h-8 w-8 items-center justify-center"><Plus className="h-3 w-3" /></button>
                  </div>
                  <button onClick={() => removeFromCart(item.productId)} className="text-destructive hover:underline"><Trash2 className="h-4 w-4" /></button>
                </div>
              </div>
            </div>
          ))}
          <button onClick={clearCart} className="text-sm text-muted-foreground hover:text-destructive">Clear cart</button>
        </div>

        <div className="glass-card h-fit rounded-xl p-5">
          <h2 className="font-semibold">Order Summary</h2>
          <div className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>{formatPrice(subtotal)}</span></div>
            {discount > 0 && <div className="flex justify-between text-emerald-600"><span>Discount</span><span>-{formatPrice(discount)}</span></div>}
            <div className="flex justify-between"><span className="text-muted-foreground">Shipping</span><span>{shipping === 0 ? 'Free' : formatPrice(shipping)}</span></div>
            <div className="flex justify-between border-t pt-2 text-base font-semibold"><span>Total</span><span>{formatPrice(total)}</span></div>
          </div>
          <div className="mt-4 flex items-center gap-2">
            <div className="relative flex-1">
              <Tag className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input value={coupon} onChange={(e) => setCoupon(e.target.value)} placeholder="Coupon code" className="rounded-full pl-9" />
            </div>
            <Button variant="outline" onClick={applyCoupon} className="rounded-full">Apply</Button>
          </div>
          {couponMsg && <p className={cn('mt-2 text-xs', discount > 0 ? 'text-emerald-600' : 'text-destructive')}>{couponMsg}</p>}
          <Button asChild className="mt-4 w-full rounded-full" size="lg"><Link href="/checkout">Proceed to Checkout</Link></Button>
          <Link href="/products" className="mt-3 block text-center text-sm text-muted-foreground hover:text-foreground">Continue shopping</Link>
        </div>
      </div>
    </div>
  );
}
