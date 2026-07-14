import Link from 'next/link';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { ChevronLeft } from 'lucide-react';
import { getCurrentUser } from '@/lib/session';
import { getToken } from '@/lib/auth';
import { dbConnect } from '@/lib/db';
import { Order } from '@/models/Order';
import { Card, CardContent } from '@/components/ui/card';
import { TrackingTimeline } from '@/components/shared/tracking-timeline';
import { formatPrice, formatDate } from '@/lib/utils';
import { ORDER_STATUS_LABELS, ORDER_STATUS_COLORS, PAYMENT_METHOD_LABELS, PAYMENT_STATUS_LABELS } from '@/lib/constants';

export const metadata = { title: 'Order Details | Lumière Beauty' };

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const payload = await getToken();
  await dbConnect();
  const order = await Order.findById(id).lean();
  if (!order || (order.customer as any).toString() !== payload?.userId) notFound();

  return (
    <div>
      <Link href="/account/orders" className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"><ChevronLeft className="h-4 w-4" /> Back to orders</Link>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 className="text-2xl font-bold">{order.orderNumber}</h2>
          <p className="text-sm text-muted-foreground">Placed {formatDate(order.createdAt)}</p>
        </div>
        <span className={`rounded-full border px-3 py-1 text-sm ${ORDER_STATUS_COLORS[order.status as keyof typeof ORDER_STATUS_COLORS]}`}>{ORDER_STATUS_LABELS[order.status as keyof typeof ORDER_STATUS_LABELS]}</span>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        <div className="space-y-6">
          <TrackingTimeline current={order.status} />
          <Card>
            <CardContent>
              <h3 className="font-semibold">Items</h3>
              <div className="mt-3 space-y-3">
                {order.items.map((it: any, i: number) => (
                  <div key={i} className="flex items-center gap-3 rounded-lg border border-white/40 p-3">
                    <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-cream-100 dark:bg-secondary/40">
                      <Image src={it.image} alt={it.name} fill className="object-cover" sizes="64px" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{it.name}</p>
                      {it.variant && <p className="text-xs text-muted-foreground">{Object.values(it.variant).filter(Boolean).join(', ')}</p>}
                      <p className="text-xs text-muted-foreground">Qty: {it.quantity}</p>
                    </div>
                    <p className="text-sm font-semibold">{formatPrice(it.price * it.quantity)}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardContent>
              <h3 className="font-semibold">Summary</h3>
              <div className="mt-3 space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>{formatPrice(order.subtotal)}</span></div>
                {order.discount > 0 && <div className="flex justify-between text-emerald-600"><span>Discount</span><span>-{formatPrice(order.discount)}</span></div>}
                <div className="flex justify-between"><span className="text-muted-foreground">Shipping</span><span>{formatPrice(order.shipping)}</span></div>
                <div className="flex justify-between border-t pt-2 font-semibold"><span>Total</span><span>{formatPrice(order.total)}</span></div>
              </div>
              <div className="mt-3 space-y-1 border-t pt-3 text-sm">
                <p className="text-muted-foreground">Payment: {PAYMENT_METHOD_LABELS[order.paymentMethod as keyof typeof PAYMENT_METHOD_LABELS]}</p>
                <p className="text-muted-foreground">Status: {PAYMENT_STATUS_LABELS[order.paymentStatus as keyof typeof PAYMENT_STATUS_LABELS]}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <h3 className="font-semibold">Shipping Address</h3>
              <div className="mt-2 text-sm text-muted-foreground">
                <p className="font-medium text-foreground">{order.shippingAddress.fullName}</p>
                <p>{order.shippingAddress.phone}</p>
                <p>{order.shippingAddress.street}</p>
                <p>{order.shippingAddress.city}, {order.shippingAddress.region}</p>
                {order.shippingAddress.landmark && <p>Landmark: {order.shippingAddress.landmark}</p>}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
