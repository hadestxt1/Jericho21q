import { env } from '@/lib/env';
import { logger } from '@/lib/logger';

export type TopupResult = {
  providerReference: string;
  status: 'PROCESSING' | 'SUCCESS' | 'FAILED';
  message: string;
};

export async function submitTopup(input: {
  orderId: string;
  providerSku: string;
  customerIdentifier: string;
}): Promise<TopupResult> {
  logger.info('Submitting placeholder PPOB/top-up provider request', {
    orderId: input.orderId,
    providerSku: input.providerSku,
    maskedCustomerIdentifier: maskIdentifier(input.customerIdentifier),
    baseUrlConfigured: Boolean(env.PROVIDER_BASE_URL),
    apiKeyConfigured: Boolean(env.PROVIDER_API_KEY),
  });

  return {
    providerReference: `prov_${input.orderId}_${Date.now()}`,
    status: 'PROCESSING',
    message: 'Placeholder provider accepted the fulfillment request.',
  };
}

function maskIdentifier(identifier: string) {
  if (identifier.length <= 4) {
    return '****';
  }
  return `${identifier.slice(0, 2)}****${identifier.slice(-2)}`;
}
