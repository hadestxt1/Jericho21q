import Link from 'next/link';
import { notFound } from 'next/navigation';
import { formatRupiah } from '@/lib/catalog';
import { getOrder } from '@/lib/orders';

const statusTone: Record<string, string> = {
  PENDING_PAYMENT: 'bg-amber-100 text-amber-700',
  PAID: 'bg-blue-100 text-blue-700',
  PROCESSING: 'bg-indigo-100 text-indigo-700',
  SUCCESS: 'bg-emerald-100 text-emerald-700',
  FAILED: 'bg-rose-100 text-rose-700',
  REFUNDED: 'bg-slate-100 text-slate-700',
};

export default async function OrderStatusPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const order = await getOrder(id);

  if (!order) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      <section className="card">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-slate-400">Order status</p>
            <h1 className="mt-2 text-3xl font-black text-ink">{order.product.name}</h1>
            <p className="mt-2 text-sm text-slate-600">Order ID: {order.id}</p>
          </div>
          <span className={`rounded-full px-4 py-2 text-sm font-black ${statusTone[order.status] ?? statusTone.PENDING_PAYMENT}`}>
            {order.status.replaceAll('_', ' ')}
          </span>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <Info label="Destination" value={order.customerIdentifier} />
          <Info label="Payment" value={order.paymentStatus.replaceAll('_', ' ')} />
          <Info label="Payment reference" value={order.paymentReference ?? 'Pending'} />
          <Info label="Provider reference" value={order.providerReference ?? 'Not submitted'} />
          <Info label="Total" value={formatRupiah(order.priceCents)} />
          <Info label="Message" value={order.statusMessage ?? 'Waiting for payment confirmation.'} />
        </div>

        <div className="mt-8 rounded-2xl bg-slate-50 p-5">
          <h2 className="font-black text-ink">Activity log</h2>
          <ol className="mt-4 space-y-3 text-sm text-slate-600">
            {order.logs.map((log) => (
              <li key={log.id} className="flex gap-3">
                <span className="mt-2 h-2 w-2 rounded-full bg-brand-600" />
                <span>{log.message}</span>
              </li>
            ))}
          </ol>
        </div>

        <Link href="/" className="btn-primary mt-8">
          Back to catalog
        </Link>
      </section>
    </main>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 p-4">
      <p className="text-xs font-bold uppercase tracking-wide text-slate-400">{label}</p>
      <p className="mt-1 font-semibold text-ink">{value}</p>
    </div>
  );
}
