'use client';
import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Upload, X, ImagePlus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { createProductAction, updateProductAction, uploadProductImageAction } from '@/actions/admin';
import { toast } from 'sonner';

interface Option { _id: string; name: string }
interface ImageItem { url: string; publicId?: string }

export function ProductForm({ categories, brands, suppliers, product }: { categories: Option[]; brands: Option[]; suppliers: Option[]; product?: any }) {
  const router = useRouter();
  const [busy, setBusy] = React.useState(false);
  const [uploading, setUploading] = React.useState(false);
  const [urlDraft, setUrlDraft] = React.useState('');
  const [images, setImages] = React.useState<ImageItem[]>(
    (product?.images || []).map((img: any) => (typeof img === 'string' ? { url: img } : { url: img?.url, publicId: img?.publicId })).filter((i: ImageItem) => i.url)
  );
  const fileRef = React.useRef<HTMLInputElement>(null);

  const addUrls = () => {
    const parsed = urlDraft.split('\n').map((s) => s.trim()).filter(Boolean).map((url) => ({ url }));
    if (!parsed.length) return;
    setImages((prev) => [...prev, ...parsed]);
    setUrlDraft('');
  };

  const removeImage = (idx: number) => setImages((prev) => prev.filter((_, i) => i !== idx));

  const onFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setUploading(true);
    for (const file of files) {
      const fd = new FormData();
      fd.append('file', file);
      const res = await uploadProductImageAction(fd);
      if (res.success && 'url' in res) setImages((prev) => [...prev, { url: res.url, publicId: res.publicId }]);
      else toast.error((res as any).error || 'Upload failed');
    }
    setUploading(false);
    if (fileRef.current) fileRef.current.value = '';
  };

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setBusy(true);
    const fd = new FormData(e.currentTarget);
    fd.set('imagesJson', JSON.stringify(images));
    const res = product ? await updateProductAction(product._id, fd) : await createProductAction(fd);
    setBusy(false);
    if (res.success) { toast.success('Saved'); router.push('/admin/products'); router.refresh(); }
    else toast.error((res as any).error || 'Failed');
  };

  return (
    <form onSubmit={submit} className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2"><Label className="text-xs">Product Name</Label><Input name="name" defaultValue={product?.name} required className="mt-1" /></div>
        <div><Label className="text-xs">Category</Label><select name="category" defaultValue={product?.category?._id || product?.category} required className="mt-1 h-10 w-full rounded-xl border border-input bg-background/60 px-2 text-sm">{categories.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}</select></div>
        <div><Label className="text-xs">Brand</Label><select name="brand" defaultValue={product?.brand?._id || product?.brand} required className="mt-1 h-10 w-full rounded-xl border border-input bg-background/60 px-2 text-sm">{brands.map((b) => <option key={b._id} value={b._id}>{b.name}</option>)}</select></div>
        <div><Label className="text-xs">Supplier</Label><select name="supplier" defaultValue={product?.supplier?._id || product?.supplier} className="mt-1 h-10 w-full rounded-xl border border-input bg-background/60 px-2 text-sm"><option value="">None</option>{suppliers.map((s) => <option key={s._id} value={s._id}>{s.name}</option>)}</select></div>
        <div><Label className="text-xs">SKU</Label><Input name="sku" defaultValue={product?.sku} className="mt-1" /></div>
        <div><Label className="text-xs">Barcode</Label><Input name="barcode" defaultValue={product?.barcode} className="mt-1" /></div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div><Label className="text-xs">Selling Price (GHS)</Label><Input name="price" type="number" step="0.01" defaultValue={product?.price} required className="mt-1" /></div>
        <div><Label className="text-xs">Cost Price (GHS)</Label><Input name="costPrice" type="number" step="0.01" defaultValue={product?.costPrice} required className="mt-1" /></div>
        <div><Label className="text-xs">Stock</Label><Input name="stock" type="number" defaultValue={product?.stock} required className="mt-1" /></div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div><Label className="text-xs">Low Stock Threshold</Label><Input name="lowStockThreshold" type="number" defaultValue={product?.lowStockThreshold || 10} className="mt-1" /></div>
        <div><Label className="text-xs">Sizes (comma separated)</Label><Input name="sizes" defaultValue={(product?.sizes || []).join(', ')} className="mt-1" /></div>
        <div><Label className="text-xs">Colors (comma separated)</Label><Input name="colors" defaultValue={(product?.colors || []).join(', ')} className="mt-1" /></div>
      </div>
      <div>
        <Label className="text-xs">Shades (comma separated)</Label>
        <Input name="shades" defaultValue={(product?.shades || []).join(', ')} className="mt-1" />
      </div>

      <div className="space-y-3 rounded-2xl border border-white/40 bg-white/40 p-4 dark:bg-white/5">
        <Label className="text-xs">Product Images</Label>
        {images.length > 0 && (
          <div className="flex flex-wrap gap-3">
            {images.map((img, i) => (
              <div key={i} className="group relative h-20 w-20 overflow-hidden rounded-xl border border-input">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img.url} alt="" className="h-full w-full object-cover" />
                <button type="button" onClick={() => removeImage(i)} className="absolute right-1 top-1 rounded-full bg-black/60 p-1 text-white opacity-0 transition group-hover:opacity-100">
                  <X className="h-3 w-3" />
                </button>
                {img.publicId && <span className="absolute bottom-0 left-0 right-0 bg-black/60 text-center text-[9px] text-white">cloud</span>}
              </div>
            ))}
          </div>
        )}
        <div>
          <Label className="text-[11px] text-muted-foreground">Add image URLs (one per line)</Label>
          <Textarea value={urlDraft} onChange={(e) => setUrlDraft(e.target.value)} placeholder="https://..." className="mt-1" rows={2} />
          <Button type="button" variant="outline" size="sm" className="mt-2" onClick={addUrls} disabled={!urlDraft.trim()}>
            <ImagePlus className="mr-1 h-3 w-3" /> Add URLs
          </Button>
        </div>
        <div className="flex items-center gap-3">
          <input ref={fileRef} type="file" accept="image/*" multiple hidden onChange={onFiles} />
          <Button type="button" variant="outline" size="sm" onClick={() => fileRef.current?.click()} disabled={uploading}>
            {uploading ? <Loader2 className="mr-1 h-3 w-3 animate-spin" /> : <Upload className="mr-1 h-3 w-3" />} Upload to Cloudinary
          </Button>
          <span className="text-[11px] text-muted-foreground">Cloudinary keys required in .env.local</span>
        </div>
      </div>

      <div>
        <Label className="text-xs">Description</Label>
        <Textarea name="description" defaultValue={product?.description} className="mt-1" />
      </div>

      <div className="flex flex-wrap gap-6">
        <label className="flex items-center gap-2 text-sm"><Switch name="isFeatured" defaultChecked={product?.isFeatured} /> Featured</label>
        <label className="flex items-center gap-2 text-sm"><Switch name="isBestSeller" defaultChecked={product?.isBestSeller} /> Best Seller</label>
        <label className="flex items-center gap-2 text-sm"><Switch name="isNewArrival" defaultChecked={product?.isNewArrival} /> New Arrival</label>
      </div>

      <div className="flex gap-2">
        <Button type="submit" disabled={busy}>{busy ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Save Product'}</Button>
        <Button type="button" variant="outline" onClick={() => router.push('/admin/products')}>Cancel</Button>
      </div>
    </form>
  );
}
