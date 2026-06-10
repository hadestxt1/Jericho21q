import { NextResponse } from 'next/server';
import { z } from 'zod';
import { createOrder } from '@/lib/orders';
import { logger } from '@/lib/logger';
import { prisma } from '@/lib/prisma';
import { createPaymentIntent } from '@/lib/services/paymentGateway';

const checkoutSchema = z.object({
  productId: z.string().min(1),
  customerIdentifier: z.string().min(4).max(64),
  customerEmail: z.string().email().optional().or(z.literal('')),
});

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const parsed = checkoutSchema.parse(Object.fromEntries(formData));
    const order = await createOrder({
      productId: parsed.productId,
      customerIdentifier: parsed.customerIdentifier,
      customerEmail: parsed.customerEmail || undefined,
    });
    const payment = await createPaymentIntent({
      orderId: order.id,
      amountCents: order.priceCents,
      customerEmail: order.customerEmail ?? undefined,
    });

    await prisma.order.update({
      where: { id: order.id },
      data: {
        paymentReference: payment.reference,
        logs: {
          create: {
            level: 'info',
            message: 'Payment intent created.',
            metadata: { paymentReference: payment.reference, expiresAt: payment.expiresAt },
          },
        },
      },
    });

    return NextResponse.redirect(new URL(payment.redirectUrl, request.url), { status: 303 });
  } catch (error) {
    logger.error('Checkout failed', { error: error instanceof Error ? error.message : String(error) });
    return NextResponse.json({ error: 'Unable to create checkout. Please verify your input and database connection.' }, { status: 400 });
  }
}
