'use client';
import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { updateOrderStatusAction } from '@/actions/admin';
import { toast } from 'sonner';

const STATUSES = [
  { value: 'pending', label: 'Pending' },
  { value: 'accepted', label: 'Accepted' },
  { value: 'processing', label: 'Processing' },
  { value: 'packed', label: 'Packed' },
  { value: 'ready', label: 'Ready for Pickup' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'cancelled', label: 'Cancelled' },
  { value: 'refunded', label: 'Refunded' },
];

export function OrderStatusUpdate({ orderId, current }: { orderId: string; current: string }) {
  const router = useRouter();
  const [status, setStatus] = React.useState(current);
  const [busy, setBusy] = React.useState(false);

  const submit = async () => {
    setBusy(true);
    const fd = new FormData();
    fd.set('orderId', orderId);
    fd.set('status', status);
    const res = await updateOrderStatusAction(fd);
    setBusy(false);
    if (res.success) { toast.success('Status updated'); router.refresh(); }
    else toast.error((res as any).error || 'Failed');
  };

  return (
    <div className="flex gap-2">
      <Select value={status} onValueChange={setStatus}>
        <SelectTrigger className="w-48"><SelectValue /></SelectTrigger>
        <SelectContent>{STATUSES.map((s) => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}</SelectContent>
      </Select>
      <Button onClick={submit} disabled={busy || status === current}>{busy ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Update'}</Button>
    </div>
  );
}

