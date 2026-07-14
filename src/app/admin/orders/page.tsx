import Link from 'next/link';
import { dbConnect } from '@/lib/db';
import { Order } from '@/models/Order';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { OrderFilter } from '@/components/admin/order-filter';
import { formatPrice, formatDate } from '@/lib/utils';
import { ORDER_STATUS_LABELS, ORDER_STATUS_COLORS, PAYMENT_METHOD_LABELS } from '@/lib/constants';

export const metadata = { title: 'Orders | Admin' };

export default async function AdminOrdersPage({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  const { status } = await searchParams;
  await dbConnect();
  const query: any = {};
  if (status) query.status = status;
  const orders = await Order.find(query).sort({ createdAt: -1 }).limit(120).lean();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div><h1 className="text-3xl font-bold">Orders</h1><p className="text-muted-foreground">{orders.length} orders</p></div>
        <OrderFilter current={status} />
      </div>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b bg-muted/40 text-xs uppercase text-muted-foreground"><tr><th className="px-4 py-3 text-left">Order</th><th className="px-4 py-3 text-left">Customer</th><th className="px-4 py-3 text-left">Date</th><th className="px-4 py-3 text-left">Payment</th><th className="px-4 py-3 text-left">Total</th><th className="px-4 py-3 text-left">Status</th><th className="px-4 py-3 text-right">Actions</th></tr></thead>
            <tbody>
              {orders.map((o: any) => (
                <tr key={o._id} className="border-b hover:bg-muted/30">
                  <td className="px-4 py-3 font-medium">{o.orderNumber}</td>
                  <td className="px-4 py-3">{o.customerName || 'Customer'}</td>
                  <td className="px-4 py-3 text-muted-foreground">{formatDate(o.createdAt)}</td>
                  <td className="px-4 py-3 text-muted-foreground">{PAYMENT_METHOD_LABELS[o.paymentMethod as keyof typeof PAYMENT_METHOD_LABELS]}</td>
                  <td className="px-4 py-3 font-semibold">{formatPrice(o.total)}</td>
                  <td className="px-4 py-3"><Badge className={ORDER_STATUS_COLORS[o.status as keyof typeof ORDER_STATUS_COLORS]}>{ORDER_STATUS_LABELS[o.status as keyof typeof ORDER_STATUS_LABELS]}</Badge></td>
                  <td className="px-4 py-3 text-right"><Button asChild variant="ghost" size="sm"><Link href={`/admin/orders/${o._id}`}>View</Link></Button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {orders.length === 0 && <p className="p-8 text-center text-muted-foreground">No orders.</p>}
      </Card>
    </div>
  );
}
