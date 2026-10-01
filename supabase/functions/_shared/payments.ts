export interface PaymentProvider {
  initiate(params: {
    amount: number;
    currency: string;
    phone: string;
    reference: string;
    returnUrl: string;
  }): Promise<{
    redirectUrl?: string;
    reference: string;
  }>;

  verify(params: {
    reference: string;
  }): Promise<{
    status: 'success' | 'failed' | 'pending';
    amount: number;
  }>;

  refund(params: {
    reference: string;
    amount: number;
  }): Promise<{
    status: 'success' | 'failed';
  }>;
}

export class MockPaymentProvider implements PaymentProvider {
  async initiate(params: {
    amount: number;
    currency: string;
    phone: string;
    reference: string;
    returnUrl: string;
  }): Promise<{ redirectUrl?: string; reference: string }> {
    console.log('[MockPayment] Initiating payment:', params);
    return {
      reference: params.reference,
      redirectUrl: `mock://payment/${params.reference}`
    };
  }

  async verify(params: { reference: string }): Promise<{
    status: 'success' | 'failed' | 'pending';
    amount: number;
  }> {
    console.log('[MockPayment] Verifying payment:', params);
    return {
      status: 'success',
      amount: 500
    };
  }

  async refund(params: { reference: string; amount: number }): Promise<{
    status: 'success' | 'failed';
  }> {
    console.log('[MockPayment] Refunding payment:', params);
    return { status: 'success' };
  }
}

export class ChapaPaymentProvider implements PaymentProvider {
  private apiKey: string;
  private baseUrl = 'https://api.chapa.co/v1';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async initiate(params: {
    amount: number;
    currency: string;
    phone: string;
    reference: string;
    returnUrl: string;
  }): Promise<{ redirectUrl?: string; reference: string }> {
    const response = await fetch(`${this.baseUrl}/transaction/initialize`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        amount: params.amount.toString(),
        currency: params.currency,
        email: '',
        phone_number: params.phone,
        tx_ref: params.reference,
        callback_url: params.returnUrl,
        return_url: params.returnUrl
      })
    });

    const data = await response.json();
    return {
      reference: params.reference,
      redirectUrl: data.data?.checkout_url
    };
  }

  async verify(params: { reference: string }): Promise<{
    status: 'success' | 'failed' | 'pending';
    amount: number;
  }> {
    const response = await fetch(
      `${this.baseUrl}/transaction/verify/${params.reference}`,
      {
        headers: { 'Authorization': `Bearer ${this.apiKey}` }
      }
    );

    const data = await response.json();
    return {
      status: data.data?.status === 'success' ? 'success' : 'failed',
      amount: parseFloat(data.data?.amount || '0')
    };
  }

  async refund(params: { reference: string; amount: number }): Promise<{
    status: 'success' | 'failed';
  }> {
    // Chapa refunds are handled via dashboard or API
    console.log('[ChapaPayment] Refund requested:', params);
    return { status: 'success' };
  }
}

export function getPaymentProvider(): PaymentProvider {
  const provider = Deno.env.get('PAYMENT_PROVIDER') || 'mock';

  switch (provider) {
    case 'chapa':
      return new ChapaPaymentProvider(Deno.env.get('CHAPA_API_KEY') || '');
    case 'mock':
    default:
      return new MockPaymentProvider();
  }
}