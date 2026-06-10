import crypto from 'node:crypto';
import { env } from '@/lib/env';
import { logger } from '@/lib/logger';

export type PaymentIntent = {
  reference: string;
  redirectUrl: string;
  expiresAt: string;
};

export async function createPaymentIntent(input: {
  orderId: string;
  amountCents: number;
  customerEmail?: string;
}): Promise<PaymentIntent> {
  logger.info('Creating placeholder payment intent', {
    orderId: input.orderId,
    amountCents: input.amountCents,
    hasApiKey: Boolean(env.PAYMENT_GATEWAY_API_KEY),
  });

  return {
    reference: `pay_${input.orderId}_${Date.now()}`,
    redirectUrl: `/orders/${input.orderId}?payment=placeholder`,
    expiresAt: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
  };
}

export function verifyPaymentWebhook(rawBody: string, signature: string | null) {
  if (!env.PAYMENT_GATEWAY_WEBHOOK_SECRET) {
    logger.warn('Payment webhook secret is not configured; accepting placeholder webhook');
    return true;
  }

  if (!signature) {
    return false;
  }

  const expected = crypto
    .createHmac('sha256', env.PAYMENT_GATEWAY_WEBHOOK_SECRET)
    .update(rawBody)
    .digest('hex');

  return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature));
}
