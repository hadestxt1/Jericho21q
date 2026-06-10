import { Prisma } from '@prisma/client';
import { demoProducts } from '@/lib/catalog';
import { logger } from '@/lib/logger';
import { prisma } from '@/lib/prisma';

export async function getProducts() {
  try {
    return await prisma.product.findMany({
      where: { status: 'ACTIVE' },
      orderBy: [{ category: 'asc' }, { priceCents: 'asc' }],
    });
  } catch (error) {
    logger.warn('Falling back to demo catalog because database is unavailable', {
      error: error instanceof Error ? error.message : String(error),
    });
    return demoProducts;
  }
}

export async function getProduct(id: string) {
  try {
    return await prisma.product.findUnique({ where: { id } });
  } catch (error) {
    logger.warn('Using demo product lookup because database is unavailable', {
      error: error instanceof Error ? error.message : String(error),
    });
    return demoProducts.find((product) => product.id === id) ?? null;
  }
}

export async function createOrder(input: {
  productId: string;
  customerIdentifier: string;
  customerEmail?: string;
}) {
  const product = await getProduct(input.productId);
  if (!product) {
    throw new Error('Product not found');
  }

  const profitCents = product.priceCents - product.costCents;

  return prisma.order.create({
    data: {
      productId: product.id,
      customerIdentifier: input.customerIdentifier,
      customerEmail: input.customerEmail,
      priceCents: product.priceCents,
      costCents: product.costCents,
      profitCents,
      logs: {
        create: {
          level: 'info',
          message: 'Order created and awaiting payment.',
        },
      },
    },
    include: { product: true, logs: { orderBy: { createdAt: 'desc' } } },
  });
}

export async function getOrder(id: string) {
  try {
    return await prisma.order.findUnique({
      where: { id },
      include: { product: true, logs: { orderBy: { createdAt: 'desc' } } },
    });
  } catch (error) {
    logger.error('Unable to load order', { id, error: error instanceof Error ? error.message : String(error) });
    return null;
  }
}

export async function getAdminSnapshot() {
  try {
    const [products, orders, totals] = await Promise.all([
      prisma.product.findMany({ orderBy: { createdAt: 'desc' } }),
      prisma.order.findMany({
        include: { product: true },
        orderBy: { createdAt: 'desc' },
        take: 25,
      }),
      prisma.order.aggregate({
        _sum: { priceCents: true, costCents: true, profitCents: true },
        _count: true,
      }),
    ]);

    return { products, orders, totals };
  } catch (error) {
    logger.warn('Admin snapshot is using demo data because database is unavailable', {
      error: error instanceof Error ? error.message : String(error),
    });
    return {
      products: demoProducts,
      orders: [],
      totals: { _sum: { priceCents: 0, costCents: 0, profitCents: 0 }, _count: 0 },
    };
  }
}

export type OrderWithProduct = Prisma.OrderGetPayload<{ include: { product: true; logs: true } }>;
