import { notFound } from 'next/navigation';
import { dbConnect } from '@/lib/db';
import { Product } from '@/models/Product';
import { Category } from '@/models/Category';
import { Brand } from '@/models/Brand';
import { Supplier } from '@/models/Supplier';
import { ProductForm } from '@/components/admin/product-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const metadata = { title: 'Edit Product | Admin' };

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await dbConnect();
  const product = await Product.findById(id).populate('category', '_id').populate('brand', '_id').populate('supplier', '_id').lean();
  if (!product) notFound();
  const [categories, brands, suppliers] = await Promise.all([Category.find().lean(), Brand.find().lean(), Supplier.find().lean()]);
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Edit Product</h1>
      <Card><CardHeader><CardTitle>{product.name}</CardTitle></CardHeader><CardContent><ProductForm product={product as any} categories={categories.map((c: any) => ({ _id: c._id.toString(), name: c.name }))} brands={brands.map((b: any) => ({ _id: b._id.toString(), name: b.name }))} suppliers={suppliers.map((s: any) => ({ _id: s._id.toString(), name: s.name }))} /></CardContent></Card>
    </div>
  );
}
