import { AuthShell } from '@/components/shared/auth-shell';
import { RegisterForm } from '@/components/shared/register-form';

export const metadata = { title: 'Register | Lumière Beauty' };

export default function RegisterPage() {
  return (
    <AuthShell title="Create your account" subtitle="Join Lumière and discover your glow">
      <RegisterForm />
    </AuthShell>
  );
}
