'use client';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { formatPrice } from '@/lib/utils';

export function RevenueChart({ data }: { data: { label: string; revenue: number; orders: number }[] }) {
  const formatted = data.map((d) => ({ ...d, revenue: Number(d.revenue.toFixed(2)) }));
  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={formatted} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#C9A96E" stopOpacity={0.5} />
            <stop offset="95%" stopColor="#C9A96E" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
        <XAxis dataKey="label" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} tickLine={false} axisLine={false} />
        <YAxis tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} tickLine={false} axisLine={false} tickFormatter={(v) => `GHS${v}`} />
        <Tooltip formatter={(v: number) => [formatPrice(v), 'Revenue']} contentStyle={{ borderRadius: 12, border: '1px solid hsl(var(--border))', background: 'hsl(var(--popover))', fontSize: 12 }} />
        <Area type="monotone" dataKey="revenue" stroke="#C9A96E" strokeWidth={2} fill="url(#rev)" />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function BarChartMini({ data }: { data: { label: string; value: number }[] }) {
  // simple placeholder using ResponsiveContainer not needed; using inline bars
  const max = Math.max(...data.map((d) => d.value), 1);
  return (
    <div className="space-y-2">
      {data.map((d) => (
        <div key={d.label} className="flex items-center gap-3">
          <span className="w-12 text-xs text-muted-foreground">{d.label}</span>
          <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
            <div className="h-full rounded-full bg-gradient-luxe" style={{ width: `${(d.value / max) * 100}%` }} />
          </div>
          <span className="w-16 text-right text-xs font-medium">{formatPrice(d.value)}</span>
        </div>
      ))}
    </div>
  );
}
