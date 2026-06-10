import { formatRupiah, categoryLabel } from '@/lib/catalog';
import { getAdminSnapshot } from '@/lib/orders';

export default async function AdminDashboard() {
  const { products, orders, totals } = await getAdminSnapshot();
  const revenue = totals._sum.priceCents ?? 0;
  const costs = totals._sum.costCents ?? 0;
  const profit = totals._sum.profitCents ?? 0;

  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <div>
        <p className="text-sm font-bold uppercase tracking-[0.3em] text-brand-600">Admin dashboard</p>
        <h1 className="mt-3 text-4xl font-black text-ink">Products, orders, and margins</h1>
        <p className="mt-3 text-slate-600">
          Connect authentication before production. This page shows the operational views and data model needed by staff.
        </p>
      </div>

      <section className="mt-8 grid gap-4 md:grid-cols-4">
        <Metric label="Orders" value={String(totals._count)} />
        <Metric label="Revenue" value={formatRupiah(revenue)} />
        <Metric label="Cost" value={formatRupiah(costs)} />
        <Metric label="Profit" value={formatRupiah(profit)} tone="text-emerald-600" />
      </section>

      <section className="mt-10 grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="card">
          <h2 className="text-2xl font-black text-ink">Product catalog</h2>
          <div className="mt-5 space-y-4">
            {products.map((product) => (
              <div key={product.id} className="rounded-2xl border border-slate-200 p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-black text-ink">{product.name}</p>
                    <p className="text-sm text-slate-500">{categoryLabel(product.category)}</p>
                  </div>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">{product.status}</span>
                </div>
                <div className="mt-3 grid grid-cols-3 gap-2 text-xs text-slate-500">
                  <span>Price {formatRupiah(product.priceCents)}</span>
                  <span>Cost {formatRupiah(product.costCents)}</span>
                  <span>Margin {formatRupiah(product.priceCents - product.costCents)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h2 className="text-2xl font-black text-ink">Recent transactions</h2>
          <div className="mt-5 overflow-hidden rounded-2xl border border-slate-200">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-4 py-3">Order</th>
                  <th className="px-4 py-3">Product</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Profit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {orders.length === 0 ? (
                  <tr>
                    <td className="px-4 py-6 text-slate-500" colSpan={4}>
                      No orders yet. Create an order from checkout once PostgreSQL is configured.
                    </td>
                  </tr>
                ) : (
                  orders.map((order) => (
                    <tr key={order.id}>
                      <td className="px-4 py-3 font-semibold text-ink">{order.id.slice(0, 8)}</td>
                      <td className="px-4 py-3 text-slate-600">{order.product.name}</td>
                      <td className="px-4 py-3 text-slate-600">{order.status}</td>
                      <td className="px-4 py-3 font-bold text-emerald-600">{formatRupiah(order.profitCents)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </main>
  );
}

function Metric({ label, value, tone = 'text-ink' }: { label: string; value: string; tone?: string }) {
  return (
    <div className="card p-5">
      <p className="text-xs font-bold uppercase tracking-wide text-slate-400">{label}</p>
      <p className={`mt-2 text-2xl font-black ${tone}`}>{value}</p>
    </div>
  );
}
