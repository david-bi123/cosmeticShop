'use client';
import { useRouter } from 'next/navigation';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ORDER_STATUS_LABELS } from '@/lib/constants';

const STATUSES = ['pending', 'accepted', 'processing', 'packed', 'ready', 'delivered', 'cancelled', 'refunded'];

export function OrderFilter({ current }: { current?: string }) {
  const router = useRouter();
  return (
    <Select value={current} onValueChange={(v) => router.push(v ? `/admin/orders?status=${v}` : '/admin/orders')}>
      <SelectTrigger className="w-44"><SelectValue placeholder="All Statuses" /></SelectTrigger>
      <SelectContent>
        <SelectItem value="__all">All Statuses</SelectItem>
        {STATUSES.map((s) => <SelectItem key={s} value={s}>{ORDER_STATUS_LABELS[s as keyof typeof ORDER_STATUS_LABELS]}</SelectItem>)}
      </SelectContent>
    </Select>
  );
}
