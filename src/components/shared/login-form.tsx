'use client';
import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { loginAction } from '@/actions/auth';
import { toast } from 'sonner';

export function LoginForm({ redirect }: { redirect?: string }) {
  const router = useRouter();
  const [busy, setBusy] = React.useState(false);

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setBusy(true);
    const res = await loginAction(new FormData(e.currentTarget));
    setBusy(false);
    if (res.success) {
      toast.success('Welcome back!');
      router.push(redirect || res.redirect || '/account');
      router.refresh();
    } else {
      toast.error((res as any).error || 'Login failed');
    }
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <div>
        <Label htmlFor="email">Email</Label>
        <div className="relative mt-1">
          <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input id="email" name="email" type="email" required placeholder="you@email.com" className="pl-9" />
        </div>
      </div>
      <div>
        <Label htmlFor="password">Password</Label>
        <div className="relative mt-1">
          <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input id="password" name="password" type="password" required placeholder="••••••••" className="pl-9" />
        </div>
      </div>
      <div className="flex justify-end">
        <Link href="/forgot-password" className="text-sm text-primary hover:underline">Forgot password?</Link>
      </div>
      <Button type="submit" disabled={busy} size="lg" className="w-full rounded-full">
        {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Sign In'}
      </Button>
      <p className="text-center text-sm text-muted-foreground">
        Don't have an account? <Link href="/register" className="text-primary hover:underline">Register</Link>
      </p>
    </form>
  );
}

