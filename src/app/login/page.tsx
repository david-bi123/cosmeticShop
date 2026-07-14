import { AuthShell } from '@/components/shared/auth-shell';
import { LoginForm } from '@/components/shared/login-form';

export const metadata = { title: 'Login | Lumière Beauty' };

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ redirect?: string }> }) {
  const { redirect } = await searchParams;
  return (
    <AuthShell title="Welcome back" subtitle="Sign in to your Lumière account">
      <LoginForm redirect={redirect} />
    </AuthShell>
  );
}
