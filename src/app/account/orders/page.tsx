import Link from 'next/link';
import { Package } from 'lucide-react';
import { getCurrentUser } from '@/lib/session';
import { dbConnect } from '@/lib/db';
import { Order } from '@/models/Order';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { formatPrice, formatDate } from '@/lib/utils';
import { ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from '@/lib/constants';

export const metadata = { title: 'My Orders | Lumière Beauty' };

export default async function OrdersPage() {
  const user = await getCurrentUser();
  if (!user) return null;
  await dbConnect();
  const orders = await Order.find({ customer: user._id }).sort({ createdAt: -1 }).lean();

  return (
    <div>
      <h2 className="text-2xl font-bold">My Orders</h2>
      {orders.length === 0 ? (
        <div className="glass-card mt-4 flex flex-col items-center justify-center py-16 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gold/15 text-gold-dark dark:text-gold-light"><Package className="h-7 w-7" /></div>
          <p className="mt-3 text-muted-foreground">You have no orders yet.</p>
          <Button asChild className="mt-4 rounded-full"><Link href="/products">Shop Now</Link></Button>
        </div>
      ) : (
        <div className="mt-4 space-y-3">
          {orders.map((o: any) => (
            <Link key={o._id} href={`/account/orders/${o._id}`}>
              <Card className="flex flex-col gap-3 p-4 transition hover:shadow-luxe sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary/50"><Package className="h-5 w-5 text-primary" /></div>
                  <div>
                    <p className="font-medium">{o.orderNumber}</p>
                    <p className="text-xs text-muted-foreground">{formatDate(o.createdAt)} · {o.items.length} item(s)</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`rounded-full border px-2.5 py-0.5 text-xs ${ORDER_STATUS_COLORS[o.status as keyof typeof ORDER_STATUS_COLORS]}`}>{ORDER_STATUS_LABELS[o.status as keyof typeof ORDER_STATUS_COLORS]}</span>
                  <span className="font-semibold">{formatPrice(o.total)}</span>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
