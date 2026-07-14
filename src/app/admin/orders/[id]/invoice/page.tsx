import Link from 'next/link';
import { notFound } from 'next/navigation';
import { dbConnect } from '@/lib/db';
import { Order } from '@/models/Order';
import { Button } from '@/components/ui/button';
import { formatPrice, formatDate } from '@/lib/utils';
import { ORDER_STATUS_LABELS, PAYMENT_METHOD_LABELS } from '@/lib/constants';

export const metadata = { title: 'Invoice | Lumière Beauty' };

export default async function InvoicePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await dbConnect();
  const order = await Order.findById(id).lean();
  if (!order) notFound();

  return (
    <div className="min-h-screen bg-white p-8 text-black print:p-0">
      <div className="mx-auto max-w-3xl">
        <div className="flex items-start justify-between border-b-2 border-gray-200 pb-6">
          <div>
            <h1 className="flex items-center gap-2 text-3xl font-bold text-pink-600">✦ Lumière Beauty</h1>
            <p className="text-sm text-gray-500">Accra Mall, Ghana · hello@lumiere.gh</p>
          </div>
          <div className="text-right">
            <p className="text-lg font-bold">INVOICE</p>
            <p className="text-sm text-gray-600">{order.orderNumber}</p>
            <p className="text-sm text-gray-600">{formatDate(order.createdAt)}</p>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-6">
          <div><p className="text-xs uppercase text-gray-400">Bill To</p><p className="font-semibold">{order.customerName}</p><p className="text-sm text-gray-600">{order.customerPhone}</p><p className="text-sm text-gray-600">{order.shippingAddress.street}, {order.shippingAddress.city}, {order.shippingAddress.region}</p></div>
          <div className="text-right"><p className="text-xs uppercase text-gray-400">Status</p><p className="font-semibold">{ORDER_STATUS_LABELS[order.status as keyof typeof ORDER_STATUS_LABELS]}</p><p className="text-sm text-gray-600">{PAYMENT_METHOD_LABELS[order.paymentMethod as keyof typeof PAYMENT_METHOD_LABELS]}</p></div>
        </div>

        <table className="mt-8 w-full text-sm">
          <thead><tr className="border-b border-gray-300 text-left text-xs uppercase text-gray-500"><th className="py-2">Item</th><th className="py-2">SKU</th><th className="py-2">Qty</th><th className="py-2 text-right">Price</th><th className="py-2 text-right">Total</th></tr></thead>
          <tbody>
            {order.items.map((it: any, i: number) => (
              <tr key={i} className="border-b border-gray-100">
                <td className="py-2">{it.name}{it.variant && <span className="text-gray-500"> ({Object.values(it.variant).filter(Boolean).join(', ')})</span>}</td>
                <td className="py-2 text-gray-500">{it.sku}</td>
                <td className="py-2">{it.quantity}</td>
                <td className="py-2 text-right">{formatPrice(it.price)}</td>
                <td className="py-2 text-right">{formatPrice(it.price * it.quantity)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-6 flex justify-end">
          <div className="w-64 space-y-1 text-sm">
            <div className="flex justify-between"><span className="text-gray-500">Subtotal</span><span>{formatPrice(order.subtotal)}</span></div>
            {order.discount > 0 && <div className="flex justify-between text-emerald-600"><span>Discount</span><span>-{formatPrice(order.discount)}</span></div>}
            <div className="flex justify-between"><span className="text-gray-500">Shipping</span><span>{formatPrice(order.shipping)}</span></div>
            <div className="flex justify-between border-t pt-2 text-base font-bold"><span>Total</span><span>{formatPrice(order.total)}</span></div>
          </div>
        </div>

        <p className="mt-10 text-center text-xs text-gray-400">Thank you for shopping with Lumière Beauty. This is a system-generated invoice.</p>
        <div className="mt-6 flex justify-center gap-3 print:hidden">
          <Button onClick={() => window.print()} className="rounded-full">Print / Save as PDF</Button>
          <Button asChild variant="outline" className="rounded-full"><Link href={`/admin/orders/${order._id}`}>Back</Link></Button>
        </div>
      </div>
    </div>
  );
}
