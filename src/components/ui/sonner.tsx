'use client';
import { Toaster as Sonner } from 'sonner';

export function Toaster() {
  return (
    <Sonner
      position="top-right"
      toastOptions={{
        classNames: {
          toast: 'glass-card rounded-xl text-foreground border border-white/40',
        },
      }}
    />
  );
}
