import Link from 'next/link';
import { CatalogProduct, categoryLabel, formatRupiah } from '@/lib/catalog';

export function ProductCard({ product }: { product: CatalogProduct }) {
  const margin = product.priceCents - product.costCents;

  return (
    <article className="card flex h-full flex-col justify-between gap-5">
      <div>
        <span className="rounded-full bg-brand-50 px-3 py-1 text-xs font-bold uppercase tracking-wide text-brand-600">
          {categoryLabel(product.category)}
        </span>
        <h3 className="mt-4 text-xl font-black text-ink">{product.name}</h3>
        <p className="mt-2 text-sm leading-6 text-slate-600">{product.description}</p>
      </div>
      <div className="space-y-4">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-xs font-semibold uppercase text-slate-400">Price</p>
            <p className="text-2xl font-black text-ink">{formatRupiah(product.priceCents)}</p>
          </div>
          <p className="text-xs font-semibold text-emerald-600">Margin {formatRupiah(margin)}</p>
        </div>
        <Link className="btn-primary w-full" href={`/checkout/${product.id}`}>
          Buy now
        </Link>
      </div>
    </article>
  );
}
