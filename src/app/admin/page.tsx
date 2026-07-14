import Link from 'next/link';
import { AlertTriangle } from 'lucide-react';
import { getDashboardMetrics } from '@/actions/admin-stats';
import { StatCard } from '@/components/admin/stat-card';
import { RevenueChart, BarChartMini } from '@/components/admin/revenue-chart';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatPrice, formatDate, imageUrl } from '@/lib/utils';
import { ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from '@/lib/constants';

export const metadata = { title: 'Admin Dashboard | Lumière Beauty' };

const DAY_NAMES: Record<number, string> = { 1: 'Sun', 2: 'Mon', 3: 'Tue', 4: 'Wed', 5: 'Thu', 6: 'Fri', 7: 'Sat' };

export default async function AdminDashboard() {
  const m = await getDashboardMetrics();
  const weekday = m.revenueByDay.map((r) => ({ label: DAY_NAMES[r.day] || '—', value: r.revenue }));

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back to your store overview</p>
        </div>
        <Link href="/admin/reports" className="text-sm font-medium text-primary hover:underline">View Reports →</Link>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Daily Revenue" value={formatPrice(m.revenue.daily)} sub="Today" icon="DollarSign" accent="bg-blush-300" delay={0} />
        <StatCard label="Weekly Revenue" value={formatPrice(m.revenue.weekly)} sub="Last 7 days" icon="TrendingUp" accent="bg-gold" delay={0.05} />
        <StatCard label="Monthly Revenue" value={formatPrice(m.revenue.monthly)} sub="Last 30 days" icon="TrendingUp" accent="bg-blush-400" delay={0.1} />
        <StatCard label="Lifetime Revenue" value={formatPrice(m.revenue.lifetime)} sub="All time" icon="DollarSign" accent="bg-primary" delay={0.15} />
      </div>

      <div className="grid gap-4 lg:grid-cols-4">
        <StatCard label="Total Orders" value={String(m.counts.totalOrders)} icon="ShoppingCart" delay={0.2} />
        <StatCard label="Pending Orders" value={String(m.counts.pendingOrders)} icon="ShoppingCart" accent="bg-amber-300" delay={0.25} />
        <StatCard label="Customers" value={String(m.counts.totalCustomers)} icon="Users" delay={0.3} />
        <StatCard label="Low / Out Stock" value={`${m.counts.lowStock} / ${m.counts.outOfStock}`} icon="AlertTriangle" accent="bg-rose-300" delay={0.35} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader><CardTitle>Revenue Trend</CardTitle></CardHeader>
          <CardContent>
            <RevenueChart data={m.salesTrend.map((s: any) => ({ label: s.date, revenue: s.revenue, orders: s.orders }))} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Revenue by Day</CardTitle></CardHeader>
          <CardContent><BarChartMini data={weekday} /></CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex-row items-center justify-between"><CardTitle>Recent Orders</CardTitle><Link href="/admin/orders" className="text-xs text-primary hover:underline">View all</Link></CardHeader>
          <CardContent className="space-y-2">
            {m.recentOrders.map((o: any) => (
              <Link key={o._id} href={`/admin/orders/${o._id}`} className="flex items-center justify-between rounded-lg border border-white/40 p-2.5 transition hover:bg-accent/5">
                <div><p className="text-sm font-medium">{o.orderNumber}</p><p className="text-xs text-muted-foreground">{o.customerName || 'Customer'} · {formatDate(o.createdAt)}</p></div>
                <div className="flex items-center gap-2"><span className={`rounded-full border px-2 py-0.5 text-xs ${ORDER_STATUS_COLORS[o.status as keyof typeof ORDER_STATUS_COLORS]}`}>{ORDER_STATUS_LABELS[o.status as keyof typeof ORDER_STATUS_LABELS]}</span><span className="text-sm font-semibold">{formatPrice(o.total)}</span></div>
              </Link>
            ))}
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader><CardTitle>Top Selling Products</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              {m.topProducts.map((p: any, i: number) => (
                <div key={i} className="flex items-center gap-3 rounded-lg border border-white/40 p-2">
                  <img src={p.image} alt={p.name} className="h-10 w-10 rounded-md object-cover" />
                  <div className="flex-1"><p className="text-sm font-medium">{p.name}</p><p className="text-xs text-muted-foreground">{p.sold} sold</p></div>
                  <span className="text-sm font-semibold">{formatPrice(p.revenue)}</span>
                </div>
              ))}
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Top Customers</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              {m.topCustomers.map((c: any, i: number) => (
                <div key={i} className="flex items-center justify-between rounded-lg border border-white/40 p-2">
                  <div className="flex items-center gap-2"><span className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-luxe text-xs font-bold text-white">{i + 1}</span><div><p className="text-sm font-medium">{c.name}</p><p className="text-xs text-muted-foreground">{c.orders} orders</p></div></div>
                  <span className="text-sm font-semibold">{formatPrice(c.spent)}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      {m.inventoryAlerts.length > 0 && (
        <Card>
          <CardHeader className="flex-row items-center justify-between"><CardTitle className="flex items-center gap-2"><AlertTriangle className="h-4 w-4 text-amber-500" /> Inventory Alerts</CardTitle><Link href="/admin/inventory" className="text-xs text-primary hover:underline">Manage</Link></CardHeader>
          <CardContent>
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
              {m.inventoryAlerts.map((p: any) => (
                <Link key={p._id} href={`/admin/products`} className="flex items-center gap-2 rounded-lg border border-white/40 p-2">
                  <img src={imageUrl(p.images?.[0])} alt={p.name} className="h-9 w-9 rounded-md object-cover" />
                  <div className="min-w-0"><p className="truncate text-sm font-medium">{p.name}</p><Badge variant={p.stock === 0 ? 'destructive' : 'warning'}>{p.stock === 0 ? 'Out of stock' : `Low: ${p.stock}`}</Badge></div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
