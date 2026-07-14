'use client';
import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, User, Phone, Loader2, Eye, EyeOff } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { registerAction } from '@/actions/auth';
import { toast } from 'sonner';

export function RegisterForm() {
  const router = useRouter();
  const [busy, setBusy] = React.useState(false);
  const [show, setShow] = React.useState(false);

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setBusy(true);
    const res = await registerAction(new FormData(e.currentTarget));
    setBusy(false);
    if (res.success) {
      toast.success('Account created!');
      router.push(res.redirect || '/account');
      router.refresh();
    } else toast.error((res as any).error || 'Registration failed');
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <div>
        <Label htmlFor="name">Full Name</Label>
        <div className="relative mt-1"><User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" /><Input id="name" name="name" required placeholder="Ama Mensah" className="pl-9" /></div>
      </div>
      <div>
        <Label htmlFor="email">Email</Label>
        <div className="relative mt-1"><Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" /><Input id="email" name="email" type="email" required placeholder="you@email.com" className="pl-9" /></div>
      </div>
      <div>
        <Label htmlFor="phone">Phone</Label>
        <div className="relative mt-1"><Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" /><Input id="phone" name="phone" required placeholder="+233 20 000 0000" className="pl-9" /></div>
      </div>
      <div>
        <Label htmlFor="password">Password</Label>
        <div className="relative mt-1">
          <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input id="password" name="password" type={show ? 'text' : 'password'} required placeholder="••••••••" className="pl-9 pr-10" />
          <button type="button" onClick={() => setShow((s) => !s)} aria-label={show ? 'Hide password' : 'Show password'} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition hover:text-foreground">
            {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </div>
      <Button type="submit" disabled={busy} size="lg" className="w-full rounded-full">
        {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Create Account'}
      </Button>
      <p className="text-center text-sm text-muted-foreground">Already have an account? <Link href="/login" className="text-primary hover:underline">Sign in</Link></p>
    </form>
  );
}

