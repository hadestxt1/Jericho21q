import { PrismaClient, ProductCategory } from '@prisma/client';

const prisma = new PrismaClient();

const products = [
  {
    name: 'Pulsa Telco 25K',
    category: ProductCategory.PULSA,
    providerSku: 'PULSA_TELCO_25K',
    description: 'Instant prepaid mobile credit for Indonesian operators.',
    priceCents: 2500000,
    costCents: 2350000,
  },
  {
    name: 'Data Freedom 12GB',
    category: ProductCategory.DATA_PACKAGE,
    providerSku: 'DATA_FREEDOM_12GB',
    description: 'Monthly 12GB data package with fast fulfillment.',
    priceCents: 5800000,
    costCents: 5325000,
  },
  {
    name: 'Legends Diamond 86',
    category: ProductCategory.GAME_VOUCHER,
    providerSku: 'GAME_LEGENDS_86',
    description: 'Game voucher delivered to a valid player ID/server ID.',
    priceCents: 2200000,
    costCents: 1950000,
  },
];

async function main() {
  for (const product of products) {
    await prisma.product.upsert({
      where: { providerSku: product.providerSku },
      update: product,
      create: product,
    });
  }
}

main()
  .finally(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
