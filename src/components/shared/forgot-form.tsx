'use client';
import * as React from 'react';
import { Mail, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { requestPasswordResetAction } from '@/actions/auth';
import { toast } from 'sonner';

export function ForgotForm() {
  const [busy, setBusy] = React.useState(false);
  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setBusy(true);
    const res = await requestPasswordResetAction(new FormData(e.currentTarget));
    setBusy(false);
    if (res.success) toast.success(res.message || 'Check your email');
    else toast.error((res as any).error || 'Failed');
  };
  return (
    <form onSubmit={submit} className="space-y-4">
      <div>
        <Label htmlFor="email">Email</Label>
        <div className="relative mt-1"><Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" /><Input id="email" name="email" type="email" required placeholder="you@email.com" className="pl-9" /></div>
      </div>
      <Button type="submit" disabled={busy} size="lg" className="w-full rounded-full">{busy ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Send Reset Link'}</Button>
    </form>
  );
}

