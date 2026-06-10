import { notFound } from 'next/navigation';
import { categoryLabel, formatRupiah } from '@/lib/catalog';
import { getProduct } from '@/lib/orders';

export default async function CheckoutPage({ params }: { params: Promise<{ productId: string }> }) {
  const { productId } = await params;
  const product = await getProduct(productId);

  if (!product) {
    notFound();
  }

  const identifierLabel = product.category === 'GAME_VOUCHER' ? 'Game ID / Server ID' : 'Phone number';

  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <aside className="card h-fit">
          <p className="text-sm font-bold uppercase tracking-wide text-brand-600">{categoryLabel(product.category)}</p>
          <h1 className="mt-3 text-3xl font-black text-ink">{product.name}</h1>
          <p className="mt-3 text-slate-600">{product.description}</p>
          <dl className="mt-6 space-y-3 text-sm">
            <div className="flex justify-between">
              <dt className="text-slate-500">Provider SKU</dt>
              <dd className="font-semibold text-ink">{product.providerSku}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-500">Price</dt>
              <dd className="text-lg font-black text-ink">{formatRupiah(product.priceCents)}</dd>
            </div>
          </dl>
        </aside>

        <section className="card">
          <h2 className="text-2xl font-black text-ink">Checkout</h2>
          <p className="mt-2 text-sm text-slate-600">
            Enter the destination details. Payments and fulfillment use clean placeholder services until real providers are connected.
          </p>
          <form action="/api/checkout" method="post" className="mt-8 space-y-5">
            <input type="hidden" name="productId" value={product.id} />
            <label className="block">
              <span className="mb-2 block text-sm font-bold text-slate-700">{identifierLabel}</span>
              <input className="input" name="customerIdentifier" placeholder="081234567890 or player-id/server" required minLength={4} />
            </label>
            <label className="block">
              <span className="mb-2 block text-sm font-bold text-slate-700">Email receipt (optional)</span>
              <input className="input" name="customerEmail" type="email" placeholder="you@example.com" />
            </label>
            <button className="btn-primary w-full" type="submit">
              Continue to payment
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}
