import Link from 'next/link';
import { Package, Heart, MapPin, Wallet } from 'lucide-react';
import { getCurrentUser } from '@/lib/session';
import { dbConnect } from '@/lib/db';
import { Order } from '@/models/Order';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ProfileForm } from '@/components/shared/profile-form';
import { formatPrice, formatDate } from '@/lib/utils';
import { ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from '@/lib/constants';

export default async function AccountOverview() {
  const user = await getCurrentUser();
  if (!user) return null;
  await dbConnect();
  const orders = await Order.find({ customer: user._id }).sort({ createdAt: -1 }).limit(5).lean();

  const stats = [
    { label: 'Total Orders', value: user.totalOrders || 0, icon: Package },
    { label: 'Lifetime Spent', value: formatPrice(user.totalSpent || 0), icon: Wallet },
    { label: 'Addresses', value: user.addresses?.length || 0, icon: MapPin },
    { label: 'Wishlist', value: '—', icon: Heart },
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <Card key={s.label} className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gold/15 text-gold-dark dark:text-gold-light"><s.icon className="h-5 w-5" /></div>
            <div>
              <p className="text-xl font-bold">{s.value}</p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </div>
          </Card>
        ))}
      </div>

      <Card>
        <CardContent>
          <h2 className="mb-4 font-semibold">Profile Information</h2>
          <ProfileForm name={user.name} phone={user.phone} email={user.email} />
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">Recent Orders</h2>
            <Button asChild variant="outline" size="sm"><Link href="/account/orders">View All</Link></Button>
          </div>
          {orders.length === 0 ? (
            <p className="mt-4 text-sm text-muted-foreground">No orders yet. <Link href="/products" className="text-primary hover:underline">Start shopping</Link></p>
          ) : (
            <div className="mt-4 space-y-3">
              {orders.map((o: any) => (
                <Link key={o._id} href={`/account/orders/${o._id}`} className="flex items-center justify-between rounded-lg border border-white/40 p-3 transition hover:bg-accent/5">
                  <div>
                    <p className="text-sm font-medium">{o.orderNumber}</p>
                    <p className="text-xs text-muted-foreground">{formatDate(o.createdAt)}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`rounded-full border px-2 py-0.5 text-xs ${ORDER_STATUS_COLORS[o.status as keyof typeof ORDER_STATUS_COLORS]}`}>{ORDER_STATUS_LABELS[o.status as keyof typeof ORDER_STATUS_LABELS]}</span>
                    <span className="text-sm font-semibold">{formatPrice(o.total)}</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
