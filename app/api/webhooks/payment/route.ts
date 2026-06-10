import { NextResponse } from 'next/server';
import { logger } from '@/lib/logger';
import { prisma } from '@/lib/prisma';
import { verifyPaymentWebhook } from '@/lib/services/paymentGateway';
import { submitTopup } from '@/lib/services/topupProvider';

type PaymentWebhookPayload = {
  paymentReference: string;
  status: 'SETTLED' | 'FAILED' | 'EXPIRED';
};

export async function POST(request: Request) {
  const rawBody = await request.text();
  const signature = request.headers.get('x-payment-signature');

  if (!verifyPaymentWebhook(rawBody, signature)) {
    logger.warn('Rejected payment webhook with invalid signature');
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
  }

  try {
    const payload = JSON.parse(rawBody) as PaymentWebhookPayload;
    const order = await prisma.order.findFirst({
      where: { paymentReference: payload.paymentReference },
      include: { product: true },
    });

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    if (payload.status !== 'SETTLED') {
      await prisma.order.update({
        where: { id: order.id },
        data: {
          paymentStatus: payload.status,
          status: 'FAILED',
          statusMessage: `Payment ${payload.status.toLowerCase()}`,
          logs: { create: { level: 'warn', message: `Payment webhook marked order as ${payload.status}.` } },
        },
      });
      return NextResponse.json({ received: true });
    }

    const provider = await submitTopup({
      orderId: order.id,
      providerSku: order.product.providerSku,
      customerIdentifier: order.customerIdentifier,
    });

    await prisma.order.update({
      where: { id: order.id },
      data: {
        paymentStatus: 'SETTLED',
        status: provider.status,
        providerReference: provider.providerReference,
        statusMessage: provider.message,
        logs: {
          create: [
            { level: 'info', message: 'Payment settled by webhook.' },
            {
              level: 'info',
              message: 'Provider fulfillment submitted.',
              metadata: { providerReference: provider.providerReference, providerStatus: provider.status },
            },
          ],
        },
      },
    });

    return NextResponse.json({ received: true });
  } catch (error) {
    logger.error('Payment webhook failed', { error: error instanceof Error ? error.message : String(error) });
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 400 });
  }
}
