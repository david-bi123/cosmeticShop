'use client';
import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { createCouponAction } from '@/actions/admin';
import { toast } from 'sonner';

export function CouponForm() {
  const router = useRouter();
  const [busy, setBusy] = React.useState(false);
  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setBusy(true);
    const res = await createCouponAction(new FormData(e.currentTarget));
    setBusy(false);
    if (res.success) { toast.success('Coupon created'); router.refresh(); (e.target as HTMLFormElement).reset(); }
    else toast.error((res as any).error || 'Failed');
  };
  return (
    <form onSubmit={submit} className="grid gap-3 sm:grid-cols-2">
      <div><Label className="text-xs">Code</Label><Input name="code" required placeholder="SAVE20" className="mt-1 uppercase" /></div>
      <div><Label className="text-xs">Description</Label><Input name="description" className="mt-1" /></div>
      <div><Label className="text-xs">Type</Label><select name="discountType" className="mt-1 h-10 w-full rounded-xl border border-input bg-background/60 px-2 text-sm"><option value="percentage">Percentage</option><option value="fixed">Fixed (GHS)</option></select></div>
      <div><Label className="text-xs">Value</Label><Input name="discountValue" type="number" step="0.01" required className="mt-1" /></div>
      <div><Label className="text-xs">Min Order (GHS)</Label><Input name="minOrder" type="number" className="mt-1" /></div>
      <div><Label className="text-xs">Max Discount (GHS)</Label><Input name="maxDiscount" type="number" className="mt-1" /></div>
      <div><Label className="text-xs">Usage Limit</Label><Input name="usageLimit" type="number" className="mt-1" /></div>
      <div><Label className="text-xs">Expires At</Label><Input name="expiresAt" type="date" className="mt-1" /></div>
      <div className="sm:col-span-2"><Button type="submit" disabled={busy} size="sm">{busy ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Create Coupon'}</Button></div>
    </form>
  );
}

