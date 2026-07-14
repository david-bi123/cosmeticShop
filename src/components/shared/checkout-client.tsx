'use client';
import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Smartphone, Banknote } from 'lucide-react';
import { useStore } from './store-provider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { formatPrice, cn } from '@/lib/utils';
import { placeOrderAction } from '@/actions/orders';
import { toast } from 'sonner';

interface Address { _id?: string; fullName: string; phone: string; street: string; city: string; region: string; landmark?: string; isDefault?: boolean }

export function CheckoutClient({ user, addresses }: { user: { name: string }; addresses: Address[] }) {
  const { cart, clearCart } = useStore();
  const router = useRouter();
  const [method, setMethod] = React.useState('cash_on_delivery');
  const [selectedAddr, setSelectedAddr] = React.useState<string>(addresses.find((a) => a.isDefault)?.fullName || '');
  const [busy, setBusy] = React.useState(false);
  const [sameAsUser, setSameAsUser] = React.useState(false);

  const subtotal = cart.reduce((a, b) => a + b.price * b.quantity, 0);
  const shipping = subtotal > 300 ? 0 : cart.length ? 25 : 0;
  const total = subtotal + shipping;

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (cart.length === 0) { toast.error('Cart is empty'); return; }
    const fd = new FormData(e.currentTarget);
    fd.set('paymentMethod', method);
    setBusy(true);
    const res = await placeOrderAction(fd);
    setBusy(false);
    if (res.success) {
      clearCart();
      toast.success('Order placed successfully!');
      router.push(`/account/orders/${res.orderId}`);
    } else {
      toast.error((res as any).error || 'Order failed');
    }
  };

  const addr = addresses.find((a) => a.fullName === selectedAddr);

  return (
    <form onSubmit={submit} className="grid gap-8 lg:grid-cols-[1fr_380px]">
      <div className="space-y-6">
        <div className="glass-card rounded-xl p-5">
          <h2 className="font-semibold">Shipping Address</h2>
          {addresses.length > 0 && (
            <div className="mt-3 space-y-2">
              {addresses.map((a) => (
                <label key={a.fullName} className={cn('flex cursor-pointer items-start gap-3 rounded-lg border p-3 transition', selectedAddr === a.fullName ? 'border-primary bg-primary/5' : 'border-white/40')}>
                  <input type="radio" name="addr" checked={selectedAddr === a.fullName} onChange={() => setSelectedAddr(a.fullName)} className="mt-1" />
                  <div className="text-sm">
                    <p className="font-medium">{a.fullName} · {a.phone}</p>
                    <p className="text-muted-foreground">{a.street}, {a.city}, {a.region}</p>
                  </div>
                </label>
              ))}
            </div>
          )}
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div><Label className="text-xs">Full Name</Label><Input name="fullName" required defaultValue={addr?.fullName || user.name} className="mt-1" /></div>
            <div><Label className="text-xs">Phone</Label><Input name="phone" required defaultValue={addr?.phone} className="mt-1" /></div>
            <div className="sm:col-span-2"><Label className="text-xs">Street Address</Label><Input name="street" required defaultValue={addr?.street} className="mt-1" /></div>
            <div><Label className="text-xs">City</Label><Input name="city" required defaultValue={addr?.city} className="mt-1" /></div>
            <div><Label className="text-xs">Region</Label><Input name="region" required defaultValue={addr?.region} className="mt-1" /></div>
            <div className="sm:col-span-2"><Label className="text-xs">Landmark (optional)</Label><Input name="landmark" defaultValue={addr?.landmark} className="mt-1" /></div>
          </div>
        </div>

        <div className="glass-card rounded-xl p-5">
          <h2 className="font-semibold">Payment Method</h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <button type="button" onClick={() => setMethod('mobile_money')} className={cn('flex items-center gap-3 rounded-xl border p-4 text-left transition', method === 'mobile_money' ? 'border-primary bg-primary/5' : 'border-white/40')}>
              <Smartphone className="h-5 w-5 text-primary" />
              <div><p className="text-sm font-medium">Mobile Money</p><p className="text-xs text-muted-foreground">MTN / Vodafone / AirtelTigo</p></div>
            </button>
            <button type="button" onClick={() => setMethod('cash_on_delivery')} className={cn('flex items-center gap-3 rounded-xl border p-4 text-left transition', method === 'cash_on_delivery' ? 'border-primary bg-primary/5' : 'border-white/40')}>
              <Banknote className="h-5 w-5 text-primary" />
              <div><p className="text-sm font-medium">Cash on Delivery</p><p className="text-xs text-muted-foreground">Pay when received</p></div>
            </button>
          </div>
          {method === 'mobile_money' && (
            <div className="mt-4 rounded-lg bg-gold/10 p-3 text-xs text-gold-dark dark:text-gold-light">
              Placeholder: In production, integrate MTN MoMo / Vodafone Cash API. Order will be marked pending until payment confirmation.
            </div>
          )}
        </div>
      </div>

      <div className="glass-card h-fit rounded-xl p-5">
        <h2 className="font-semibold">Order Summary</h2>
        <div className="mt-3 max-h-60 space-y-2 overflow-y-auto">
          {cart.map((item) => (
            <div key={item.productId + JSON.stringify(item.variant)} className="flex justify-between text-sm">
              <span className="truncate pr-2">{item.name} × {item.quantity}</span>
              <span>{formatPrice(item.price * item.quantity)}</span>
            </div>
          ))}
        </div>
        <div className="mt-3 space-y-2 border-t pt-3 text-sm">
          <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>{formatPrice(subtotal)}</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">Shipping</span><span>{shipping === 0 ? 'Free' : formatPrice(shipping)}</span></div>
          <div className="flex justify-between text-base font-semibold"><span>Total</span><span>{formatPrice(total)}</span></div>
        </div>
        <Button type="submit" disabled={busy} size="lg" className="mt-4 w-full rounded-full">{busy ? 'Placing order...' : 'Place Order'}</Button>
      </div>
    </form>
  );
}

