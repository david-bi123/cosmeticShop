'use client';
import { useEffect } from 'react';
import { useStore } from './store-provider';

export function TrackRecentlyViewed({ productId }: { productId: string }) {
  const { addRecentlyViewed } = useStore();
  useEffect(() => {
    addRecentlyViewed(productId);
  }, [productId, addRecentlyViewed]);
  return null;
}
