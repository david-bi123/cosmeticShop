'use client';
import { Download, FileSpreadsheet, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Column { key: string; label: string }

export function ReportExporter({ title, columns, rows }: { title: string; columns: Column[]; rows: Record<string, any>[] }) {
  const toCSV = () => {
    const head = columns.map((c) => c.label).join(',');
    const body = rows.map((r) => columns.map((c) => `"${String(r[c.key] ?? '').replace(/"/g, '""')}"`).join(',')).join('\n');
    const csv = `${head}\n${body}`;
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const print = () => {
    const w = window.open('', '_blank', 'width=900,height=700');
    if (!w) return;
    const head = columns.map((c) => `<th style="border:1px solid #ccc;padding:6px;text-align:left">${c.label}</th>`).join('');
    const body = rows.map((r) => `<tr>${columns.map((c) => `<td style="border:1px solid #ccc;padding:6px">${r[c.key] ?? ''}</td>`).join('')}</tr>`).join('');
    w.document.write(`<html><head><title>${title}</title></head><body><h2>${title}</h2><table style="border-collapse:collapse;width:100%;font-size:13px"><thead><tr>${head}</tr></thead><tbody>${body}</tbody></table><script>window.onload=()=>window.print()</script></body></html>`);
    w.document.close();
  };

  return (
    <div className="flex gap-2">
      <Button size="sm" variant="outline" onClick={toCSV} className="rounded-full"><FileSpreadsheet className="h-4 w-4" /> CSV</Button>
      <Button size="sm" variant="outline" onClick={print} className="rounded-full"><FileText className="h-4 w-4" /> PDF</Button>
    </div>
  );
}
