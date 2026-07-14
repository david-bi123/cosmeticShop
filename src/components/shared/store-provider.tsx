'use client';
import * as React from 'react';
import { toast } from 'sonner';

export interface CartItem {
  productId: string;
  name: string;
  slug: string;
  image: string;
  price: number;
  quantity: number;
  variant?: { size?: string; color?: string; shade?: string; weight?: string };
  stock: number;
  sku: string;
}

interface StoreContextValue {
  cart: CartItem[];
  wishlist: string[];
  recentlyViewed: string[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (productId: string) => void;
  updateQty: (productId: string, qty: number) => void;
  clearCart: () => void;
  toggleWishlist: (productId: string) => void;
  inWishlist: (productId: string) => boolean;
  addRecentlyViewed: (productId: string) => void;
  cartCount: number;
}

const StoreContext = React.createContext<StoreContextValue | undefined>(undefined);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = React.useState<CartItem[]>([]);
  const [wishlist, setWishlist] = React.useState<string[]>([]);
  const [recentlyViewed, setRecentlyViewed] = React.useState<string[]>([]);

  React.useEffect(() => {
    try {
      setCart(JSON.parse(localStorage.getItem('cs_cart') || '[]'));
      setWishlist(JSON.parse(localStorage.getItem('cs_wishlist') || '[]'));
      setRecentlyViewed(JSON.parse(localStorage.getItem('cs_recently') || '[]'));
    } catch {
      /* ignore */
    }
  }, []);

  const persistCart = (next: CartItem[]) => {
    setCart(next);
    localStorage.setItem('cs_cart', JSON.stringify(next));
    document.cookie = `cs_cart=${encodeURIComponent(JSON.stringify(next))}; path=/; max-age=${60 * 60 * 24 * 7}`;
  };

  const addToCart = (item: CartItem) => {
    const existing = cart.find(
      (c) => c.productId === item.productId && JSON.stringify(c.variant) === JSON.stringify(item.variant)
    );
    let next: CartItem[];
    if (existing) {
      next = cart.map((c) =>
        c.productId === item.productId && JSON.stringify(c.variant) === JSON.stringify(item.variant)
          ? { ...c, quantity: Math.min(c.quantity + item.quantity, c.stock) }
          : c
      );
    } else {
      next = [...cart, item];
    }
    persistCart(next);
    toast.success('Added to cart');
  };

  const removeFromCart = (productId: string) => persistCart(cart.filter((c) => c.productId !== productId));
  const updateQty = (productId: string, qty: number) => {
    if (qty <= 0) return removeFromCart(productId);
    persistCart(cart.map((c) => (c.productId === productId ? { ...c, quantity: Math.min(qty, c.stock) } : c)));
  };
  const clearCart = () => persistCart([]);

  const toggleWishlist = (productId: string) => {
    let next: string[];
    if (wishlist.includes(productId)) {
      next = wishlist.filter((w) => w !== productId);
      toast('Removed from wishlist');
    } else {
      next = [...wishlist, productId];
      toast.success('Added to wishlist');
    }
    setWishlist(next);
    localStorage.setItem('cs_wishlist', JSON.stringify(next));
  };

  const addRecentlyViewed = (productId: string) => {
    const next = [productId, ...recentlyViewed.filter((r) => r !== productId)].slice(0, 12);
    setRecentlyViewed(next);
    localStorage.setItem('cs_recently', JSON.stringify(next));
  };

  const inWishlist = (productId: string) => wishlist.includes(productId);
  const cartCount = cart.reduce((a, b) => a + b.quantity, 0);

  return (
    <StoreContext.Provider
      value={{ cart, wishlist, recentlyViewed, addToCart, removeFromCart, updateQty, clearCart, toggleWishlist, inWishlist, addRecentlyViewed, cartCount }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const ctx = React.useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used within StoreProvider');
  return ctx;
}
