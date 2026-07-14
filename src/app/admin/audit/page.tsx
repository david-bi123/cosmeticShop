import { dbConnect } from '@/lib/db';
import { AuditLog } from '@/models/AuditLog';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatDateTime } from '@/lib/utils';

export const metadata = { title: 'Audit Logs | Admin' };

export default async function AuditPage({ searchParams }: { searchParams: Promise<{ entity?: string }> }) {
  const { entity } = await searchParams;
  await dbConnect();
  const query: any = {};
  if (entity) query.entity = entity;
  const logs = await AuditLog.find(query).sort({ createdAt: -1 }).limit(150).lean();
  const entities = ['product', 'order', 'user', 'coupon', 'inventory'];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div><h1 className="text-3xl font-bold">Audit Logs</h1><p className="text-muted-foreground">Security & activity trail</p></div>
        <div className="flex flex-wrap gap-1">
          <a href="/admin/audit" className={`rounded-full px-3 py-1 text-xs ${!entity ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>All</a>
          {entities.map((e) => (
            <a key={e} href={`/admin/audit?entity=${e}`} className={`rounded-full px-3 py-1 text-xs capitalize ${entity === e ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>{e}</a>
          ))}
        </div>
      </div>
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b bg-muted/40 text-xs uppercase text-muted-foreground"><tr><th className="px-4 py-3 text-left">Action</th><th className="px-4 py-3 text-left">Entity</th><th className="px-4 py-3 text-left">By</th><th className="px-4 py-3 text-left">Details</th><th className="px-4 py-3 text-left">Date</th></tr></thead>
            <tbody>
              {logs.map((l: any) => (
                <tr key={l._id} className="border-b hover:bg-muted/30">
                  <td className="px-4 py-3 font-medium">{l.action}</td>
                  <td className="px-4 py-3"><Badge variant="outline">{l.entity}</Badge></td>
                  <td className="px-4 py-3 text-muted-foreground">{l.performedByRole || 'system'}</td>
                  <td className="px-4 py-3 text-muted-foreground">{l.details || '—'}</td>
                  <td className="px-4 py-3 text-muted-foreground">{formatDateTime(l.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {logs.length === 0 && <p className="p-8 text-center text-muted-foreground">No logs.</p>}
      </Card>
    </div>
  );
}
