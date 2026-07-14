import { getCategories } from '@/actions/catalog';
import { getCurrentUser } from '@/lib/session';
import { Header } from '@/components/shared/header';
import { Footer } from '@/components/shared/footer';

export default async function StoreLayout({ children }: { children: React.ReactNode }) {
  const [categories, user] = await Promise.all([getCategories(), getCurrentUser()]);
  return (
    <div className="flex min-h-screen flex-col">
      <Header categories={categories.map((c) => ({ _id: c._id.toString(), name: c.name, slug: c.slug }))} user={user ? { name: user.name, role: user.role } : null} />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
