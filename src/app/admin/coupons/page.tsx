import { Plus } from 'lucide-react';
import { dbConnect } from '@/lib/db';
import { Coupon } from '@/models/Coupon';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { CouponForm } from '@/components/admin/coupon-form';
import { formatDate } from '@/lib/utils';

export const metadata = { title: 'Coupons | Admin' };

export default async function CouponsPage() {
  await dbConnect();
  const coupons = await Coupon.find().sort({ createdAt: -1 }).lean();
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-3xl font-bold">Coupons</h1><p className="text-muted-foreground">{coupons.length} coupons</p></div>
        <Dialog>
          <DialogTrigger asChild><Button className="rounded-full"><Plus className="h-4 w-4" /> New Coupon</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Create Coupon</DialogTitle></DialogHeader>
            <CouponForm />
          </DialogContent>
        </Dialog>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {coupons.map((c: any) => (
          <Card key={c._id} className="p-4">
            <div className="flex items-center justify-between"><span className="text-lg font-bold">{c.code}</span><Badge variant={c.isActive ? 'success' : 'secondary'}>{c.isActive ? 'Active' : 'Inactive'}</Badge></div>
            <p className="mt-1 text-sm text-muted-foreground">{c.description}</p>
            <p className="mt-2 text-sm font-semibold">{c.discountType === 'percentage' ? `${c.discountValue}% off` : `${c.discountValue} GHS off`}</p>
            <p className="mt-1 text-xs text-muted-foreground">Used {c.usedCount}{c.usageLimit ? ` / ${c.usageLimit}` : ''} · Expires {c.expiresAt ? formatDate(c.expiresAt) : 'Never'}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
