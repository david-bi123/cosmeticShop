import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-cream-50 px-6 text-center dark:bg-background">
      <span className="text-6xl">✦</span>
      <h1 className="mt-4 text-4xl font-bold luxe-gradient-text">404</h1>
      <p className="mt-2 text-muted-foreground">The page you're looking for doesn't exist.</p>
      <Button asChild className="mt-6 rounded-full"><Link href="/">Back to Home</Link></Button>
    </div>
  );
}
