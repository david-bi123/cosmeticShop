import { dbConnect } from '@/lib/db';
import { Order } from '@/models/Order';
import { Product } from '@/models/Product';
import { User } from '@/models/User';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { RevenueChart } from '@/components/admin/revenue-chart';
import { ReportExporter } from '@/components/admin/report-exporter';
import { formatPrice, formatDate } from '@/lib/utils';

export const metadata = { title: 'Reports | Admin' };

export default async function ReportsPage() {
  await dbConnect();
  const paid = { status: { $nin: ['cancelled', 'refunded'] } };

  const [salesAgg, orderCount, topProducts, inventory, topCustomers, monthly] = await Promise.all([
    Order.aggregate([{ $match: paid }, { $group: { _id: null, revenue: { $sum: '$total' }, items: { $sum: '$items.quantity' } } }]),
    Order.countDocuments(paid),
    Order.aggregate([
      { $match: paid },
      { $unwind: '$items' },
      { $group: { _id: '$items.product', name: { $first: '$items.name' }, sold: { $sum: '$items.quantity' }, revenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } } } },
      { $sort: { revenue: -1 } }, { $limit: 20 },
    ]),
    Product.find().lean(),
    Order.aggregate([
      { $match: paid },
      { $group: { _id: '$customer', spent: { $sum: '$total' }, orders: { $sum: 1 } } },
      { $sort: { spent: -1 } }, { $limit: 20 },
    ]),
    Order.aggregate([{ $match: paid }, { $group: { _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } }, revenue: { $sum: '$total' }, orders: { $sum: 1 } } }, { $sort: { _id: 1 } }, { $limit: 12 }]),
  ]);

  const totalRevenue = salesAgg[0]?.revenue || 0;
  const totalItems = salesAgg[0]?.items || 0;
  const avgOrder = orderCount ? totalRevenue / orderCount : 0;
  const stockValue = inventory.reduce((a: number, p: any) => a + (p.costPrice || 0) * (p.stock || 0), 0);
  const lowStock = inventory.filter((p: any) => p.stock <= 10).length;

  const custIds = topCustomers.map((c) => c._id);
  const custDocs = await User.find({ _id: { $in: custIds } }).lean();
  const custRows = topCustomers.map((c: any) => {
    const u = custDocs.find((x: any) => x._id.toString() === c._id.toString());
    return { id: c._id, name: (u as any)?.name, email: (u as any)?.email, spent: Number(c.spent.toFixed(2)), orders: c.orders };
  });

  const productRows = topProducts.map((p: any) => ({ id: p._id, name: p.name, sold: p.sold, revenue: Number(p.revenue.toFixed(2)) }));
  const salesRows = monthly.map((m: any) => ({ month: m._id, revenue: Number(m.revenue.toFixed(2)), orders: m.orders }));
  const inventoryRows = inventory.slice(0, 50).map((p: any) => ({ sku: p.sku, name: p.name, stock: p.stock, cost: p.costPrice, value: (p.costPrice || 0) * (p.stock || 0) }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Reports</h1>
        <p className="text-muted-foreground">Analytics, exports (CSV / PDF) and business insights</p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Card><CardContent><p className="text-xs text-muted-foreground">Total Revenue</p><p className="text-2xl font-bold">{formatPrice(totalRevenue)}</p></CardContent></Card>
        <Card><CardContent><p className="text-xs text-muted-foreground">Orders</p><p className="text-2xl font-bold">{orderCount}</p></CardContent></Card>
        <Card><CardContent><p className="text-xs text-muted-foreground">Avg Order Value</p><p className="text-2xl font-bold">{formatPrice(avgOrder)}</p></CardContent></Card>
        <Card><CardContent><p className="text-xs text-muted-foreground">Inventory Value</p><p className="text-2xl font-bold">{formatPrice(stockValue)}</p></CardContent></Card>
      </div>

      <Tabs defaultValue="sales">
        <TabsList className="flex-wrap">
          <TabsTrigger value="sales">Sales</TabsTrigger>
          <TabsTrigger value="product">Products</TabsTrigger>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
          <TabsTrigger value="customer">Customers</TabsTrigger>
        </TabsList>

        <TabsContent value="sales">
          <Card>
            <CardHeader className="flex-row items-center justify-between"><CardTitle>Monthly Revenue</CardTitle><ReportExporter title="Sales Report" columns={[{ key: 'month', label: 'Month' }, { key: 'revenue', label: 'Revenue (GHS)' }, { key: 'orders', label: 'Orders' }]} rows={salesRows} /></CardHeader>
            <CardContent><RevenueChart data={monthly.map((m: any) => ({ label: m._id, revenue: m.revenue, orders: m.orders }))} /></CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="product">
          <Card>
            <CardHeader className="flex-row items-center justify-between"><CardTitle>Top Products</CardTitle><ReportExporter title="Product Report" columns={[{ key: 'name', label: 'Product' }, { key: 'sold', label: 'Units Sold' }, { key: 'revenue', label: 'Revenue (GHS)' }]} rows={productRows} /></CardHeader>
            <CardContent>
              <table className="w-full text-sm"><thead className="border-b text-xs uppercase text-muted-foreground"><tr><th className="py-2 text-left">Product</th><th className="py-2 text-left">Units</th><th className="py-2 text-right">Revenue</th></tr></thead><tbody>{productRows.map((p) => (<tr key={p.id} className="border-b"><td className="py-2">{p.name}</td><td className="py-2">{p.sold}</td><td className="py-2 text-right">{formatPrice(p.revenue)}</td></tr>))}</tbody></table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="inventory">
          <Card>
            <CardHeader className="flex-row items-center justify-between"><CardTitle>Inventory ({lowStock} low/out)</CardTitle><ReportExporter title="Inventory Report" columns={[{ key: 'sku', label: 'SKU' }, { key: 'name', label: 'Name' }, { key: 'stock', label: 'Stock' }, { key: 'cost', label: 'Cost' }, { key: 'value', label: 'Value' }]} rows={inventoryRows} /></CardHeader>
            <CardContent>
              <div className="max-h-96 overflow-y-auto"><table className="w-full text-sm"><thead className="border-b text-xs uppercase text-muted-foreground"><tr><th className="py-2 text-left">SKU</th><th className="py-2 text-left">Name</th><th className="py-2 text-left">Stock</th><th className="py-2 text-right">Value</th></tr></thead><tbody>{inventoryRows.map((p: any) => (<tr key={p.sku} className="border-b"><td className="py-2 text-muted-foreground">{p.sku}</td><td className="py-2">{p.name}</td><td className="py-2">{p.stock}</td><td className="py-2 text-right">{formatPrice(p.value)}</td></tr>))}</tbody></table></div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="customer">
          <Card>
            <CardHeader className="flex-row items-center justify-between"><CardTitle>Top Customers</CardTitle><ReportExporter title="Customer Report" columns={[{ key: 'name', label: 'Name' }, { key: 'email', label: 'Email' }, { key: 'orders', label: 'Orders' }, { key: 'spent', label: 'Lifetime Spend' }]} rows={custRows} /></CardHeader>
            <CardContent>
              <table className="w-full text-sm"><thead className="border-b text-xs uppercase text-muted-foreground"><tr><th className="py-2 text-left">Name</th><th className="py-2 text-left">Email</th><th className="py-2 text-left">Orders</th><th className="py-2 text-right">Spent</th></tr></thead><tbody>{custRows.map((c) => (<tr key={c.id} className="border-b"><td className="py-2">{c.name}</td><td className="py-2 text-muted-foreground">{c.email}</td><td className="py-2">{c.orders}</td><td className="py-2 text-right">{formatPrice(c.spent)}</td></tr>))}</tbody></table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
