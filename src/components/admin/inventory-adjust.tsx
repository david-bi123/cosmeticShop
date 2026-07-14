'use client';
import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { adjustStockAction } from '@/actions/admin';
import { toast } from 'sonner';

export function InventoryAdjust({ productId, productName }: { productId: string; productName: string }) {
  const router = useRouter();
  const [busy, setBusy] = React.useState(false);
  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setBusy(true);
    const fd = new FormData(e.currentTarget);
    const res = await adjustStockAction(fd);
    setBusy(false);
    if (res.success) { toast.success('Stock updated'); router.push('/admin/inventory'); router.refresh(); }
    else toast.error((res as any).error || 'Failed');
  };
  return (
    <form onSubmit={submit} className="space-y-3">
      <input type="hidden" name="productId" value={productId} />
      <p className="text-sm text-muted-foreground">{productName}</p>
      <div><Label className="text-xs">Type</Label><select name="type" required className="mt-1 h-10 w-full rounded-xl border border-input bg-background/60 px-2 text-sm"><option value="restock">Restock</option><option value="adjustment">Adjustment (+)</option><option value="return">Return (+)</option><option value="damage">Damage (-)</option></select></div>
      <div><Label className="text-xs">Quantity</Label><Input name="quantity" type="number" min={1} required className="mt-1" /></div>
      <div><Label className="text-xs">Reason</Label><Input name="reason" className="mt-1" /></div>
      <Button type="submit" disabled={busy} size="sm">{busy ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Apply'}</Button>
    </form>
  );
}

