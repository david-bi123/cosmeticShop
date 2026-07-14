'use client';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

const STEPS = ['pending', 'accepted', 'processing', 'packed', 'ready', 'delivered'];
const LABELS: Record<string, string> = {
  pending: 'Order Placed',
  accepted: 'Accepted',
  processing: 'Processing',
  packed: 'Packed',
  ready: 'Ready for Pickup',
  delivered: 'Delivered',
};

export function TrackingTimeline({ current }: { current: string }) {
  const idx = STEPS.indexOf(current);
  const cancelled = current === 'cancelled' || current === 'refunded';

  if (cancelled) {
    return <div className="glass-card rounded-xl p-4 text-center text-destructive">This order was {current}.</div>;
  }

  return (
    <div className="glass-card rounded-xl p-5">
      <h3 className="mb-4 font-semibold">Order Tracking</h3>
      <div className="relative flex justify-between">
        <div className="absolute left-0 right-0 top-4 h-0.5 bg-muted" />
        <motion.div className="absolute left-0 top-4 h-0.5 bg-gradient-luxe" initial={{ width: 0 }} animate={{ width: `${(idx / (STEPS.length - 1)) * 100}%` }} transition={{ duration: 0.8 }} />
        {STEPS.map((s, i) => (
          <div key={s} className="relative z-10 flex flex-col items-center text-center">
            <div className={cn('flex h-8 w-8 items-center justify-center rounded-full border-2 transition', i <= idx ? 'border-primary bg-primary text-primary-foreground' : 'border-muted bg-background')}>
              {i < idx ? <Check className="h-4 w-4" /> : <span className="text-xs font-semibold">{i + 1}</span>}
            </div>
            <span className={cn('mt-2 max-w-[70px] text-[11px]', i <= idx ? 'font-medium' : 'text-muted-foreground')}>{LABELS[s]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
