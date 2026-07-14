import { dbConnect } from '@/lib/db';
import { User } from '@/models/User';
import { Order } from '@/models/Order';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CustomerActions } from '@/components/admin/customer-actions';
import { formatPrice, formatDate } from '@/lib/utils';

export const metadata = { title: 'Customers | Admin' };

export default async function CustomersPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q } = await searchParams;
  await dbConnect();
  const query: any = { role: 'customer' };
  if (q) query.$or = [{ name: { $regex: q, $options: 'i' } }, { email: { $regex: q, $options: 'i' } }, { phone: { $regex: q, $options: 'i' } }];
  const customers = await User.find(query).sort({ totalSpent: -1 }).limit(200).lean();
  const orderCounts = await Order.aggregate([{ $group: { _id: '$customer', count: { $sum: 1 } } }]);
  const counts = Object.fromEntries(orderCounts.map((o) => [(o._id as any).toString(), o.count]));

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div><h1 className="text-3xl font-bold">Customers</h1><p className="text-muted-foreground">{customers.length} customers</p></div>
        <form className="relative"><input name="q" defaultValue={q} placeholder="Search customers..." className="h-10 w-56 rounded-full border border-input bg-background/60 pl-4 pr-4 text-sm" /></form>
      </div>
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b bg-muted/40 text-xs uppercase text-muted-foreground"><tr><th className="px-4 py-3 text-left">Name</th><th className="px-4 py-3 text-left">Email</th><th className="px-4 py-3 text-left">Phone</th><th className="px-4 py-3 text-left">Orders</th><th className="px-4 py-3 text-left">Lifetime Spend</th><th className="px-4 py-3 text-left">Joined</th><th className="px-4 py-3 text-left">Status</th><th className="px-4 py-3 text-right">Actions</th></tr></thead>
            <tbody>
              {customers.map((c: any) => (
                <tr key={c._id} className="border-b hover:bg-muted/30">
                  <td className="px-4 py-3 font-medium">{c.name}</td>
                  <td className="px-4 py-3 text-muted-foreground">{c.email}</td>
                  <td className="px-4 py-3 text-muted-foreground">{c.phone || '—'}</td>
                  <td className="px-4 py-3">{counts[c._id.toString()] || 0}</td>
                  <td className="px-4 py-3 font-semibold">{formatPrice(c.totalSpent || 0)}</td>
                  <td className="px-4 py-3 text-muted-foreground">{formatDate(c.createdAt)}</td>
                  <td className="px-4 py-3">{c.blocked ? <Badge variant="destructive">Blocked</Badge> : <Badge variant="success">Active</Badge>}</td>
                  <td className="px-4 py-3"><CustomerActions id={c._id.toString()} blocked={!!c.blocked} notes={c.notes || ''} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
