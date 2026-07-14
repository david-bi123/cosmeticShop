import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(amount: number, currency = 'GHS'): string {
  return new Intl.NumberFormat('en-GH', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(amount);
}

export function formatNumber(n: number): string {
  return new Intl.NumberFormat('en-GH').format(n);
}

export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString('en-GH', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function formatDateTime(date: Date | string): string {
  return new Date(date).toLocaleString('en-GH', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function timeAgo(date: Date | string): string {
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return formatDate(date);
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

export function generateSKU(prefix: string, n: number): string {
  return `${prefix.toUpperCase()}-${String(n).padStart(5, '0')}`;
}

export function generateBarcode(): string {
  return String(Math.floor(Math.random() * 9_000_000_000_000) + 1_000_000_000_000);
}

export function paginate<T>(items: T[], page: number, pageSize: number) {
  const start = (page - 1) * pageSize;
  return {
    data: items.slice(start, start + pageSize),
    total: items.length,
    page,
    pageSize,
    totalPages: Math.ceil(items.length / pageSize),
  };
}

export function truncate(text: string, length: number): string {
  return text.length > length ? text.slice(0, length) + '...' : text;
}

export function average(nums: number[]): number {
  if (!nums.length) return 0;
  return nums.reduce((a, b) => a + b, 0) / nums.length;
}

export type ImageInput = string | { url?: string; publicId?: string } | null | undefined;

export function imageUrl(img: ImageInput): string {
  if (!img) return '';
  if (typeof img === 'string') return img;
  return img.url || '';
}

export function normalizeImages(images: ImageInput[] | undefined): { url: string; publicId?: string }[] {
  if (!images) return [];
  const out: { url: string; publicId?: string }[] = [];
  for (const img of images) {
    if (!img) continue;
    if (typeof img === 'string') {
      if (img) out.push({ url: img });
    } else if (img.url) {
      out.push({ url: img.url, publicId: img.publicId });
    }
  }
  return out;
}
