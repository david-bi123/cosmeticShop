'use client';
import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Ban, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { updateCustomerAction } from '@/actions/admin';
import { toast } from 'sonner';

export function CustomerActions({ id, blocked, notes }: { id: string; blocked: boolean; notes: string }) {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [busy, setBusy] = React.useState(false);

  if (!open) {
    return (
      <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
        {blocked ? <CheckCircle2 className="h-4 w-4" /> : <Ban className="h-4 w-4" />} {blocked ? 'Unblock' : 'Manage'}
      </Button>
    );
  }

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setBusy(true);
    const fd = new FormData(e.currentTarget);
    const res = await updateCustomerAction(fd);
    setBusy(false);
    if (res.success) { toast.success('Updated'); setOpen(false); router.refresh(); }
    else toast.error((res as any).error || 'Failed');
  };

  return (
    <form onSubmit={submit} className="space-y-2 rounded-lg border border-white/40 p-2">
      <input type="hidden" name="id" value={id} />
      <label className="flex items-center gap-2 text-sm"><Switch name="blocked" defaultChecked={blocked} /> Block customer</label>
      <Textarea name="notes" defaultValue={notes} placeholder="Internal notes..." className="text-sm" />
      <div className="flex gap-2">
        <Button type="submit" size="sm" disabled={busy}>{busy ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Save'}</Button>
        <Button type="button" size="sm" variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
      </div>
    </form>
  );
}

