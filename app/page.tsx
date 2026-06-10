import { ProductCard } from '@/components/ProductCard';
import { getProducts } from '@/lib/orders';

export default async function Home() {
  const products = await getProducts();

  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <section className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.3em] text-brand-600">Digital fulfillment</p>
          <h1 className="mt-4 text-4xl font-black tracking-tight text-ink sm:text-6xl">
            Top up pulsa, data, and game vouchers in one secure flow.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
            A production-ready starter with PostgreSQL/Prisma models, checkout, placeholder payment webhooks,
            placeholder PPOB provider calls, status tracking, and admin visibility.
          </p>
        </div>
        <div className="card bg-gradient-to-br from-brand-600 to-brand-900 text-white">
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-100">Operational checklist</p>
          <ul className="mt-6 space-y-4 text-sm text-blue-50">
            <li>✓ Secure API keys through environment variables</li>
            <li>✓ Structured logging for payments and provider requests</li>
            <li>✓ Profit margin tracked per order</li>
            <li>✓ Admin dashboard for catalog and transaction monitoring</li>
          </ul>
        </div>
      </section>

      <section className="mt-14">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-slate-400">Catalog</p>
            <h2 className="text-3xl font-black text-ink">Choose a product</h2>
          </div>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </main>
  );
}
