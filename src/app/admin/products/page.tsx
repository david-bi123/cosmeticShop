import Link from 'next/link';
import { Plus, Pencil, Trash2, Search } from 'lucide-react';
import { dbConnect } from '@/lib/db';
import { Product } from '@/models/Product';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { formatPrice, imageUrl } from '@/lib/utils';

export const metadata = { title: 'Products | Admin' };

export default async function AdminProductsPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q } = await searchParams;
  await dbConnect();
  const query: any = {};
  if (q) query.$or = [{ name: { $regex: q, $options: 'i' } }, { sku: { $regex: q, $options: 'i' } }];
  const products = await Product.find(query).populate('category', 'name').populate('brand', 'name').sort({ createdAt: -1 }).limit(100).lean();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold">Products</h1>
          <p className="text-muted-foreground">{products.length} products</p>
        </div>
        <div className="flex items-center gap-2">
          <form className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input name="q" defaultValue={q} placeholder="Search..." className="w-48 rounded-full pl-9" />
          </form>
          <Button asChild className="rounded-full"><Link href="/admin/products/new"><Plus className="h-4 w-4" /> Add Product</Link></Button>
        </div>
      </div>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b bg-muted/40 text-xs uppercase text-muted-foreground">
              <tr>
                <th className="px-4 py-3 text-left">Product</th>
                <th className="px-4 py-3 text-left">SKU</th>
                <th className="px-4 py-3 text-left">Category</th>
                <th className="px-4 py-3 text-left">Price</th>
                <th className="px-4 py-3 text-left">Stock</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p: any) => (
                <tr key={p._id} className="border-b transition hover:bg-muted/30">
                  <td className="px-4 py-3"><div className="flex items-center gap-3"><img src={imageUrl(p.images?.[0])} alt={p.name} className="h-10 w-10 rounded-md object-cover" /><div><p className="font-medium">{p.name}</p><p className="text-xs text-muted-foreground">{(p.brand as any)?.name}</p></div></div></td>
                  <td className="px-4 py-3 text-muted-foreground">{p.sku}</td>
                  <td className="px-4 py-3">{(p.category as any)?.name}</td>
                  <td className="px-4 py-3 font-semibold">{formatPrice(p.price)}</td>
                  <td className="px-4 py-3"><Badge variant={p.stock === 0 ? 'destructive' : p.stock <= 10 ? 'warning' : 'success'}>{p.stock}</Badge></td>
                  <td className="px-4 py-3">{p.isActive ? <Badge variant="success">Active</Badge> : <Badge>Hidden</Badge>}</td>
                  <td className="px-4 py-3"><div className="flex justify-end gap-1"><Button asChild variant="ghost" size="icon"><Link href={`/admin/products/${p._id}/edit`}><Pencil className="h-4 w-4" /></Link></Button></div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {products.length === 0 && <p className="p-8 text-center text-muted-foreground">No products found.</p>}
      </Card>
    </div>
  );
}
