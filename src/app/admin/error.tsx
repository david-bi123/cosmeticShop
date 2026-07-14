'use client';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function AdminError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const isDbError = error.message?.includes('MONGODB_URI') || error.message?.includes('connect') || error.message?.includes('ENOTFOUND');
  return (
    <div className="flex min-h-[50vh] items-center justify-center p-6">
      <Card className="mx-auto max-w-lg text-center">
        <CardHeader>
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-rose-100 text-rose-600">
            <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" /></svg>
          </div>
          <CardTitle className="text-xl">Something went wrong</CardTitle>
          <CardDescription className="mt-2">
            {isDbError
              ? 'Unable to connect to the database. Please check that your environment variables are configured correctly on Vercel.'
              : 'An unexpected error occurred while loading the admin page.'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button onClick={reset} variant="default" className="w-full rounded-full">Try again</Button>
          <Link href="/admin" className="block w-full"><Button variant="outline" className="w-full rounded-full">Back to Dashboard</Button></Link>
          <p className="pt-2 text-xs text-muted-foreground">
            Error digest: {error.digest || 'N/A'}
            {isDbError && (
              <span className="block pt-2">
                Make sure <code className="rounded bg-muted px-1 py-0.5 text-[10px]">MONGODB_URI</code>,
                <code className="rounded bg-muted px-1 py-0.5 text-[10px]">JWT_SECRET</code> and
                other env vars are set in the{' '}
                <a href="https://vercel.com/docs/projects/environment-variables" target="_blank" rel="noopener" className="underline">
                  Vercel dashboard
                </a>
                .
              </span>
            )}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
