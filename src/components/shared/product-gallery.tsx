'use client';
import * as React from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { cn, imageUrl, type ImageInput } from '@/lib/utils';

export function ProductGallery({ images, name }: { images: ImageInput[]; name: string }) {
  const imgs = (images && images.length ? images.map(imageUrl) : []).filter(Boolean);
  const fallback = 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&q=80';
  const [active, setActive] = React.useState(0);

  return (
    <div className="flex flex-col gap-3">
      <div className="relative aspect-square overflow-hidden rounded-2xl border border-white/40 bg-cream-100 shadow-glass dark:bg-secondary/40">
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0"
          >
            <Image src={imgs[active] || fallback} alt={name} fill className="object-cover" sizes="(max-width:768px) 100vw, 500px" priority />
          </motion.div>
        </AnimatePresence>
      </div>
      {imgs.length > 1 && (
        <div className="flex gap-3 overflow-x-auto">
          {imgs.map((img, i) => (
            <button key={i} onClick={() => setActive(i)} className={cn('relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border-2 transition', active === i ? 'border-primary' : 'border-transparent')}>
              <Image src={img} alt={`${name} ${i + 1}`} fill className="object-cover" sizes="80px" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
