'use client';
import * as React from 'react';
import { Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { updateProfileAction } from '@/actions/auth';
import { toast } from 'sonner';

export function ProfileForm({ name, phone, email }: { name: string; phone?: string; email: string }) {
  const [busy, setBusy] = React.useState(false);
  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setBusy(true);
    const res = await updateProfileAction(new FormData(e.currentTarget));
    setBusy(false);
    if (res.success) toast.success(res.message || 'Saved');
    else toast.error((res as any).error || 'Failed');
  };
  return (
    <form onSubmit={submit} className="grid gap-3 sm:grid-cols-2">
      <div><Label className="text-xs">Full Name</Label><Input name="name" defaultValue={name} required className="mt-1" /></div>
      <div><Label className="text-xs">Phone</Label><Input name="phone" defaultValue={phone} className="mt-1" /></div>
      <div className="sm:col-span-2"><Label className="text-xs">Email</Label><Input value={email} disabled className="mt-1 opacity-70" /></div>
      <div className="sm:col-span-2"><Button type="submit" disabled={busy} size="sm">{busy ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Save Changes'}</Button></div>
    </form>
  );
}

