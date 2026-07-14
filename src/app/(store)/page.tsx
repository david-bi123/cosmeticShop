import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Sparkles, Truck, ShieldCheck, RotateCcw } from 'lucide-react';
import { getFeaturedProducts, getBestSellers, getNewArrivals, getCategories, getBrands } from '@/actions/catalog';
import { ProductCard } from '@/components/shared/product-card';
import { Reveal, Stagger, StaggerItem } from '@/components/shared/reveal';
import { Button } from '@/components/ui/button';

export default async function HomePage() {
  const [featured, best, news, categories, brands] = await Promise.all([
    getFeaturedProducts(8),
    getBestSellers(8),
    getNewArrivals(8),
    getCategories(),
    getBrands(),
  ]);

  return (
    <div className="flex flex-col">
      {/* HERO */}
      <section className="relative max-h-[calc(100svh-4rem)] overflow-hidden bg-gradient-to-b from-blush-100 via-cream-50 to-background dark:from-secondary/40 dark:via-background dark:to-background">
        <div className="absolute -right-20 -top-20 h-96 w-96 rounded-full bg-blush-200/40 blur-3xl" />
        <div className="absolute -left-20 bottom-0 h-96 w-96 rounded-full bg-gold/20 blur-3xl" />
        <div className="container grid items-start gap-8 py-8 md:grid-cols-2 md:gap-10 md:py-12">
          <Reveal className="pt-6 md:pt-16">
            <span className="inline-flex items-center gap-1 rounded-full border border-white/40 bg-white/50 px-3 py-1 text-xs font-medium text-primary backdrop-blur dark:bg-white/5">
              <Sparkles className="h-3 w-3" /> New Collection 2026
            </span>
            <h1 className="mt-4 text-4xl font-bold leading-tight tracking-tight md:text-6xl">
              Discover Your <span className="luxe-gradient-text">Radiance</span>
            </h1>
            <p className="mt-4 max-w-md text-muted-foreground">
              Premium skincare, makeup and fragrances curated for the modern Ghanaian beauty. Luxury that feels like you.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild size="lg" className="rounded-full">
                <Link href="/products">Shop Now <ArrowRight className="h-4 w-4" /></Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-full">
                <Link href="/products?best=1">Best Sellers</Link>
              </Button>
            </div>
          </Reveal>
          <Reveal delay={0.2} className="relative">
            <div className="relative mx-auto aspect-[4/5] max-h-[58vh] w-full max-w-xs overflow-hidden rounded-[2rem] border border-white/40 shadow-luxe md:max-w-sm">
              <Image src="https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&q=80" alt="Luxury cosmetics" fill priority className="object-cover" sizes="(max-width:768px) 100vw, 400px" />
            </div>
            <div className="absolute -bottom-5 -left-5 hidden rounded-2xl border border-white/40 bg-white/70 p-4 shadow-glass backdrop-blur-xl dark:bg-white/10 sm:block">
              <p className="text-2xl font-bold luxe-gradient-text">1k+</p>
              <p className="text-xs text-muted-foreground">Happy customers</p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* VALUE PROPS */}
      <section className="container grid gap-4 py-8 sm:grid-cols-2 md:grid-cols-4">
        {[
          { icon: Truck, title: 'Fast Delivery', text: 'Across Ghana in 24-48h' },
          { icon: ShieldCheck, title: '100% Authentic', text: 'Original products only' },
          { icon: RotateCcw, title: 'Easy Returns', text: '14-day return policy' },
          { icon: Sparkles, title: 'Curated Luxury', text: 'Handpicked brands' },
        ].map((v) => (
          <div key={v.title} className="glass-card flex items-center gap-3 rounded-xl p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gold/15 text-gold-dark dark:text-gold-light"><v.icon className="h-5 w-5" /></div>
            <div><p className="text-sm font-semibold">{v.title}</p><p className="text-xs text-muted-foreground">{v.text}</p></div>
          </div>
        ))}
      </section>

      {/* FEATURED */}
      <Section title="Featured Products" subtitle="Our handpicked favorites for you" href="/products?featured=1">
        <Stagger className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {featured.map((p, i) => (
            <StaggerItem key={p._id.toString()}><ProductCard product={p as any} index={i} /></StaggerItem>
          ))}
        </Stagger>
      </Section>

      {/* CATEGORIES */}
      <section className="container py-12">
        <Reveal>
          <div className="flex items-end justify-between">
            <div><h2 className="text-2xl font-bold md:text-3xl">Shop by Category</h2><p className="text-muted-foreground">Find exactly what your routine needs</p></div>
          </div>
        </Reveal>
        <Stagger className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
          {categories.slice(0, 6).map((c, i) => (
            <StaggerItem key={c._id.toString()}>
              <Link href={`/products?category=${c.slug}`} className="group block overflow-hidden rounded-2xl border border-white/40 bg-white/60 shadow-glass transition hover:shadow-luxe dark:bg-white/5">
                <div className="relative aspect-square">
                  {c.image ? (
                    <Image src={c.image} alt={c.name} fill className="object-cover transition group-hover:scale-110" sizes="150px" />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-gradient-luxe text-3xl text-white">✦</div>
                  )}
                </div>
                <p className="py-3 text-center text-sm font-medium">{c.name}</p>
              </Link>
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      {/* BEST SELLERS */}
      <Section title="Best Sellers" subtitle="Loved by our community" href="/products?best=1">
        <Stagger className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {best.map((p, i) => (
            <StaggerItem key={p._id.toString()}><ProductCard product={p as any} index={i} /></StaggerItem>
          ))}
        </Stagger>
      </Section>

      {/* BRANDS */}
      <section className="container py-12">
        <Reveal><h2 className="text-2xl font-bold md:text-3xl">Top Brands</h2><p className="text-muted-foreground">World-class beauty houses</p></Reveal>
        <Stagger className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-6">
          {brands.slice(0, 6).map((b, i) => (
            <StaggerItem key={b._id.toString()}>
              <Link href={`/products?brand=${b.slug}`} className="flex h-24 items-center justify-center rounded-2xl border border-white/40 bg-white/60 text-center font-semibold shadow-glass transition hover:shadow-luxe dark:bg-white/5">
                {b.name}
              </Link>
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      {/* NEW ARRIVALS */}
      <Section title="New Arrivals" subtitle="Fresh drops just for you" href="/products?new=1">
        <Stagger className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {news.map((p, i) => (
            <StaggerItem key={p._id.toString()}><ProductCard product={p as any} index={i} /></StaggerItem>
          ))}
        </Stagger>
      </Section>

      {/* NEWSLETTER */}
      <section className="container py-12">
        <div className="relative overflow-hidden rounded-3xl border border-white/40 bg-gradient-luxe p-8 text-white shadow-luxe md:p-12">
          <div className="absolute inset-0 bg-black/10" />
          <div className="relative max-w-xl">
            <h2 className="text-3xl font-bold">Join the Lumière Circle</h2>
            <p className="mt-2 opacity-90">Get exclusive offers, early access to launches and beauty tips.</p>
            <form action="/api/newsletter" method="post" className="mt-5 flex flex-col gap-3 sm:flex-row">
              <input name="email" type="email" required placeholder="your@email.com" className="h-12 flex-1 rounded-full border border-white/30 bg-white/20 px-5 text-white placeholder:text-white/70 outline-none focus:ring-2 focus:ring-white/50" />
              <button className="h-12 rounded-full bg-white px-6 font-semibold text-primary transition hover:bg-white/90">Subscribe</button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}

function Section({ title, subtitle, href, children }: { title: string; subtitle: string; href?: string; children: React.ReactNode }) {
  return (
    <section className="container py-10">
      <Reveal>
        <div className="flex items-end justify-between">
          <div><h2 className="text-2xl font-bold md:text-3xl">{title}</h2><p className="text-muted-foreground">{subtitle}</p></div>
          {href && <Link href={href} className="hidden items-center gap-1 text-sm font-medium text-primary hover:underline md:flex">View all <ArrowRight className="h-4 w-4" /></Link>}
        </div>
      </Reveal>
      <div className="mt-6">{children}</div>
    </section>
  );
}
