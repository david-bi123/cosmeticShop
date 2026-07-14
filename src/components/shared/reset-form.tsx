'use client';
import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { resetPasswordAction } from '@/actions/auth';
import { toast } from 'sonner';

export function ResetForm({ token }: { token: string }) {
  const router = useRouter();
  const [busy, setBusy] = React.useState(false);
  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setBusy(true);
    const res = await resetPasswordAction(token, new FormData(e.currentTarget));
    setBusy(false);
    if (res.success) { toast.success('Password updated'); router.push(res.redirect || '/login'); }
    else toast.error((res as any).error || 'Failed');
  };
  return (
    <form onSubmit={submit} className="space-y-4">
      <div>
        <Label htmlFor="password">New Password</Label>
        <div className="relative mt-1"><Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" /><Input id="password" name="password" type="password" required minLength={6} placeholder="••••••••" className="pl-9" /></div>
      </div>
      <Button type="submit" disabled={busy} size="lg" className="w-full rounded-full">{busy ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Update Password'}</Button>
    </form>
  );
}

