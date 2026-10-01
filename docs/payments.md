# Senik Payment System

## Overview

Senik uses a pluggable payment provider architecture. The current implementation includes a mock provider for development and testing, with clear integration points for Chapa and telebirr.

## Architecture

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Customer  │────▶│  create-    │────▶│  Payment    │
│    App      │     │  order      │     │  Provider   │
└─────────────┘     └─────────────┘     └──────┬──────┘
                                               │
                                        ┌──────┴──────┐
                                        │  Mock /     │
                                        │  Chapa /    │
                                        │  telebirr   │
                                        └─────────────┘
```

## Payment Providers

### Interface

```typescript
interface PaymentProvider {
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
```

### Mock Provider

The mock provider simulates telebirr/CBE Birr checkout:

1. Customer initiates payment
2. Mock checkout screen appears (success/fail/cancel)
3. Webhook callback verifies payment
4. Order status updated to `paid`

**Environment**: `PAYMENT_PROVIDER=mock`

### Chapa Integration

Chapa is a popular Ethiopian payment gateway.

**Setup**:
1. Register at [chapa.co](https://chapa.co)
2. Get API key
3. Set `PAYMENT_PROVIDER=chapa`
4. Set `CHAPA_API_KEY` in Supabase Vault

**Flow**:
1. Customer initiates payment
2. Redirect to Chapa checkout
3. Customer pays via Chapa
4. Chapa webhook notifies Senik
5. Order status updated to `paid`

### telebirr Integration

telebirr is Ethiopia's mobile money service.

**Setup**:
1. Register as telebirr merchant
2. Get API credentials
3. Set `PAYMENT_PROVIDER=telebirr`
4. Set `TELEBIRR_API_KEY` in Supabase Vault

**Flow**:
1. Customer initiates payment
2. telebirr push notification sent
3. Customer approves on phone
4. telebirr webhook notifies Senik
5. Order status updated to `paid`

## Cash on Delivery

Cash on delivery is fully supported:

1. Customer selects "Cash on Delivery" at checkout
2. Order created with `payment_method: 'cash'`
3. Rider collects cash on delivery
4. Payment record created with `status: 'completed'`

## Edge Functions

### `payment-initiate`

Initiates a payment for an order.

**Input**:
```json
{
  "orderId": "uuid",
  "amount": 500,
  "paymentMethod": "telebirr",
  "phoneNumber": "+251912345678"
}
```

**Output**:
```json
{
  "paymentId": "uuid",
  "redirectUrl": "https://checkout.chapa.co/...",
  "reference": "CHAPA-12345"
}
```

### `payment-webhook`

Receives payment confirmation from provider.

**Headers**:
- `X-Chapa-Signature`: HMAC signature (Chapa)
- `X-Telebirr-Signature`: HMAC signature (telebirr)

**Input**:
```json
{
  "reference": "CHAPA-12345",
  "status": "success",
  "amount": 500
}
```

**Actions**:
1. Verify signature
2. Update payment record
3. Update order status to `paid`
4. Send push notification to customer

### `payment-cod`

Records cash collection by rider.

**Input**:
```json
{
  "orderId": "uuid",
  "amountCollected": 500
}
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `PAYMENT_PROVIDER` | `mock`, `chapa`, or `telebirr` | Yes |
| `CHAPA_API_KEY` | Chapa API key | If using Chapa |
| `CHAPA_WEBHOOK_SECRET` | Chapa webhook secret | If using Chapa |
| `TELEBIRR_API_KEY` | telebirr API key | If using telebirr |
| `TELEBIRR_WEBHOOK_SECRET` | telebirr webhook secret | If using telebirr |

## Testing

### Mock Provider Tests

```typescript
describe('MockProvider', () => {
  it('should initiate payment', async () => {
    const result = await provider.initiate({
      amount: 500,
      currency: 'ETB',
      phone: '+251912345678',
      reference: 'TEST-123',
      returnUrl: 'https://senik.com/return'
    });
    expect(result.reference).toBeDefined();
  });

  it('should verify payment', async () => {
    const result = await provider.verify({ reference: 'TEST-123' });
    expect(result.status).toBe('success');
  });
});
```

### E2E Payment Flow

1. Customer adds items to cart
2. Customer proceeds to checkout
3. Customer selects payment method
4. Mock checkout screen appears
5. Customer selects "Success"
6. Order confirmed with payment

## Refunds

Refunds are processed by admins through the admin portal:

1. Admin selects order
2. Admin clicks "Refund"
3. Refund processed via payment provider
4. Payment record updated to `status: 'refunded'`
5. Customer notified

## Security

- All payment webhooks verified with HMAC signatures
- Payment amounts validated against order total
- Idempotency keys prevent duplicate charges
- Payment logs retained for 7 years (compliance)

## Future Enhancements

- [ ] Split payments (rider tip + order total)
- [ ] Partial refunds
- [ ] Payment plans (buy now, pay later)
- [ ] Loyalty points integration