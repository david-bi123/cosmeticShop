'use client';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export function StatCard({ label, value, sub, icon: Icon, accent, delay = 0 }: { label: string; value: string; sub?: string; icon: any; accent?: string; delay?: number }) {
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay }}>
      <Card className="relative overflow-hidden p-5">
        <div className={cn('absolute -right-6 -top-6 h-20 w-20 rounded-full opacity-20 blur-2xl', accent || 'bg-gold')} />
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className="mt-1 text-2xl font-bold">{value}</p>
            {sub && <p className="mt-1 text-xs text-muted-foreground">{sub}</p>}
          </div>
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gold/15 text-gold-dark dark:text-gold-light"><Icon className="h-5 w-5" /></div>
        </div>
      </Card>
    </motion.div>
  );
}
