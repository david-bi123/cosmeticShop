'use client';
import * as React from 'react';
import { Loader2, ShieldCheck } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { changePasswordAction } from '@/actions/auth';
import { toast } from 'sonner';

export function SecurityForm({ email, verified }: { email: string; verified: boolean }) {
  const [busy, setBusy] = React.useState(false);
  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setBusy(true);
    const res = await changePasswordAction(new FormData(e.currentTarget));
    setBusy(false);
    if (res.success) { toast.success(res.message || 'Password updated'); }
    else toast.error((res as any).error || 'Failed');
  };
  return (
    <div className="space-y-6">
      <div className="glass-card rounded-xl p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium">Email</p>
            <p className="text-sm text-muted-foreground">{email}</p>
          </div>
          <span className={`flex items-center gap-1 rounded-full px-3 py-1 text-xs ${verified ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
            <ShieldCheck className="h-3 w-3" /> {verified ? 'Verified' : 'Unverified'}
          </span>
        </div>
        {!verified && <Button variant="outline" size="sm" className="mt-3">Resend Verification</Button>}
      </div>

      <form onSubmit={submit} className="glass-card space-y-4 rounded-xl p-4">
        <h3 className="font-semibold">Change Password</h3>
        <div><Label className="text-xs">Current Password</Label><Input name="current" type="password" required className="mt-1" /></div>
        <div><Label className="text-xs">New Password</Label><Input name="password" type="password" required minLength={6} className="mt-1" /></div>
        <Button type="submit" disabled={busy} size="sm">{busy ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Update Password'}</Button>
      </form>
    </div>
  );
}

