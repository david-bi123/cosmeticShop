import { dbConnect } from '@/lib/db';
import { Category } from '@/models/Category';
import { Brand } from '@/models/Brand';
import { Supplier } from '@/models/Supplier';
import { ProductForm } from '@/components/admin/product-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const metadata = { title: 'New Product | Admin' };

export default async function NewProductPage() {
  await dbConnect();
  const [categories, brands, suppliers] = await Promise.all([
    Category.find().lean(),
    Brand.find().lean(),
    Supplier.find().lean(),
  ]);
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Add Product</h1>
      <Card><CardHeader><CardTitle>Product Details</CardTitle></CardHeader><CardContent><ProductForm categories={categories.map((c: any) => ({ _id: c._id.toString(), name: c.name }))} brands={brands.map((b: any) => ({ _id: b._id.toString(), name: b.name }))} suppliers={suppliers.map((s: any) => ({ _id: s._id.toString(), name: s.name }))} /></CardContent></Card>
    </div>
  );
}
