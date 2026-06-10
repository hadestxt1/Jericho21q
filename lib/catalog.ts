export type ProductCategory = 'PULSA' | 'DATA_PACKAGE' | 'GAME_VOUCHER';

export type CatalogProduct = {
  id: string;
  name: string;
  category: ProductCategory;
  providerSku: string;
  description: string;
  priceCents: number;
  costCents: number;
  status: 'ACTIVE' | 'INACTIVE';
};

export const demoProducts: CatalogProduct[] = [
  {
    id: 'demo-pulsa-25k',
    name: 'Pulsa Telco 25K',
    category: 'PULSA',
    providerSku: 'PULSA_TELCO_25K',
    description: 'Instant prepaid mobile credit for Indonesian operators.',
    priceCents: 2500000,
    costCents: 2350000,
    status: 'ACTIVE',
  },
  {
    id: 'demo-data-12gb',
    name: 'Data Freedom 12GB',
    category: 'DATA_PACKAGE',
    providerSku: 'DATA_FREEDOM_12GB',
    description: 'Monthly 12GB data package with fast fulfillment.',
    priceCents: 5800000,
    costCents: 5325000,
    status: 'ACTIVE',
  },
  {
    id: 'demo-game-86',
    name: 'Legends Diamond 86',
    category: 'GAME_VOUCHER',
    providerSku: 'GAME_LEGENDS_86',
    description: 'Game voucher delivered to a valid player ID/server ID.',
    priceCents: 2200000,
    costCents: 1950000,
    status: 'ACTIVE',
  },
];

export function categoryLabel(category: ProductCategory) {
  return {
    PULSA: 'Pulsa',
    DATA_PACKAGE: 'Data Package',
    GAME_VOUCHER: 'Game Voucher',
  }[category];
}

export function formatRupiah(cents: number) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(cents / 100);
}
