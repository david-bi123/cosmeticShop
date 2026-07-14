import { dbConnect } from '@/lib/db';
import { InventoryTransaction } from '@/models/InventoryTransaction';
import { Product } from '@/models/Product';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { InventoryAdjust } from '@/components/admin/inventory-adjust';
import { formatDate, formatDateTime, imageUrl } from '@/lib/utils';

export const metadata = { title: 'Inventory | Admin' };

export default async function InventoryPage() {
  await dbConnect();
  const [transactions, lowStock, outOfStock, products] = await Promise.all([
    InventoryTransaction.find().populate('product', 'name images').populate('performedBy', 'name').sort({ createdAt: -1 }).limit(40).lean(),
    Product.find({ stock: { $gt: 0, $lte: 10 } }).lean(),
    Product.find({ stock: 0 }).lean(),
    Product.find().limit(200).lean(),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between">
        <div><h1 className="text-3xl font-bold">Inventory</h1><p className="text-muted-foreground">Track stock movements & alerts</p></div>
        <Dialog>
          <DialogTrigger asChild><Button className="rounded-full">Adjust Stock</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Select Product to Adjust</DialogTitle></DialogHeader>
            <div className="max-h-80 space-y-2 overflow-y-auto">
              {products.map((p: any) => (
                <Dialog key={p._id}>
                  <DialogTrigger asChild>
                    <button className="flex w-full items-center gap-2 rounded-lg border border-white/40 p-2 text-left text-sm hover:bg-accent/5">
                      <img src={imageUrl(p.images?.[0])} className="h-8 w-8 rounded object-cover" />
                      <span className="flex-1">{p.name}</span>
                      <Badge variant={p.stock === 0 ? 'destructive' : 'warning'}>{p.stock}</Badge>
                    </button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader><DialogTitle>Adjust Stock</DialogTitle></DialogHeader>
                    <InventoryAdjust productId={p._id.toString()} productName={p.name} />
                  </DialogContent>
                </Dialog>
              ))}
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card><CardHeader><CardTitle className="text-base">Low Stock ({lowStock.length})</CardTitle></CardHeader><CardContent className="space-y-2">{lowStock.slice(0, 6).map((p: any) => (<div key={p._id} className="flex items-center justify-between rounded-lg border border-white/40 p-2"><span className="text-sm">{p.name}</span><Badge variant="warning">{p.stock} left</Badge></div>))}{lowStock.length === 0 && <p className="text-sm text-muted-foreground">None</p>}</CardContent></Card>
        <Card><CardHeader><CardTitle className="text-base">Out of Stock ({outOfStock.length})</CardTitle></CardHeader><CardContent className="space-y-2">{outOfStock.slice(0, 6).map((p: any) => (<div key={p._id} className="flex items-center justify-between rounded-lg border border-white/40 p-2"><span className="text-sm">{p.name}</span><Badge variant="destructive">0</Badge></div>))}{outOfStock.length === 0 && <p className="text-sm text-muted-foreground">None</p>}</CardContent></Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Stock History</CardTitle></CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b text-xs uppercase text-muted-foreground"><tr><th className="px-3 py-2 text-left">Product</th><th className="px-3 py-2 text-left">Type</th><th className="px-3 py-2 text-left">Change</th><th className="px-3 py-2 text-left">Stock After</th><th className="px-3 py-2 text-left">By</th><th className="px-3 py-2 text-left">Date</th></tr></thead>
              <tbody>
                {transactions.map((t: any) => (
                  <tr key={t._id} className="border-b">
                    <td className="px-3 py-2">{(t.product as any)?.name || '—'}</td>
                    <td className="px-3 py-2 capitalize">{t.type}</td>
                    <td className={`px-3 py-2 font-medium ${t.quantity < 0 ? 'text-destructive' : 'text-emerald-600'}`}>{t.quantity > 0 ? `+${t.quantity}` : t.quantity}</td>
                    <td className="px-3 py-2">{t.newStock}</td>
                    <td className="px-3 py-2">{(t.performedBy as any)?.name || 'system'}</td>
                    <td className="px-3 py-2 text-muted-foreground">{formatDateTime(t.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
