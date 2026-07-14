import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ChevronLeft, Printer, Mail } from 'lucide-react';
import { dbConnect } from '@/lib/db';
import { Order } from '@/models/Order';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { OrderStatusUpdate } from '@/components/admin/order-status-update';
import { formatPrice, formatDate, formatDateTime } from '@/lib/utils';
import { ORDER_STATUS_LABELS, ORDER_STATUS_COLORS, PAYMENT_METHOD_LABELS, PAYMENT_STATUS_LABELS } from '@/lib/constants';

export const metadata = { title: 'Order | Admin' };

export default async function AdminOrderDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await dbConnect();
  const order = await Order.findById(id).lean();
  if (!order) notFound();

  return (
    <div>
      <Link href="/admin/orders" className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"><ChevronLeft className="h-4 w-4" /> Back to orders</Link>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div><h1 className="text-3xl font-bold">{order.orderNumber}</h1><p className="text-sm text-muted-foreground">{formatDateTime(order.createdAt)}</p></div>
        <Badge className={ORDER_STATUS_COLORS[order.status as keyof typeof ORDER_STATUS_COLORS]}>{ORDER_STATUS_LABELS[order.status as keyof typeof ORDER_STATUS_LABELS]}</Badge>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        <div className="space-y-6">
          <Card>
            <CardHeader><CardTitle>Items ({order.items.length})</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {order.items.map((it: any, i: number) => (
                <div key={i} className="flex items-center gap-3 rounded-lg border border-white/40 p-3">
                  <img src={it.image} className="h-14 w-14 rounded-md object-cover" />
                  <div className="flex-1"><p className="text-sm font-medium">{it.name}</p>{it.variant && <p className="text-xs text-muted-foreground">{Object.values(it.variant).filter(Boolean).join(', ')}</p>}<p className="text-xs text-muted-foreground">{it.sku} · Qty {it.quantity}</p></div>
                  <span className="text-sm font-semibold">{formatPrice(it.price * it.quantity)}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Update Status</CardTitle></CardHeader>
            <CardContent><OrderStatusUpdate orderId={order._id.toString()} current={order.status} /></CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader><CardTitle>Summary</CardTitle></CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>{formatPrice(order.subtotal)}</span></div>
              {order.discount > 0 && <div className="flex justify-between text-emerald-600"><span>Discount</span><span>-{formatPrice(order.discount)}</span></div>}
              <div className="flex justify-between"><span className="text-muted-foreground">Shipping</span><span>{formatPrice(order.shipping)}</span></div>
              <div className="flex justify-between border-t pt-2 font-semibold"><span>Total</span><span>{formatPrice(order.total)}</span></div>
              <div className="space-y-1 border-t pt-2"><p className="text-muted-foreground">Payment: {PAYMENT_METHOD_LABELS[order.paymentMethod as keyof typeof PAYMENT_METHOD_LABELS]}</p><p className="text-muted-foreground">Status: {PAYMENT_STATUS_LABELS[order.paymentStatus as keyof typeof PAYMENT_STATUS_LABELS]}</p></div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Customer & Shipping</CardTitle></CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p className="font-medium">{order.customerName}</p>
              <p className="text-muted-foreground">{order.customerPhone}</p>
              <p className="text-muted-foreground">{order.shippingAddress.street}, {order.shippingAddress.city}, {order.shippingAddress.region}</p>
            </CardContent>
          </Card>
          <div className="flex flex-col gap-2">
            <Button asChild className="rounded-full"><Link href={`/admin/orders/${order._id}/invoice`}><Printer className="h-4 w-4" /> Generate Invoice / Print</Link></Button>
            <Button variant="outline" className="rounded-full" disabled><Mail className="h-4 w-4" /> Email Receipt (setup)</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
