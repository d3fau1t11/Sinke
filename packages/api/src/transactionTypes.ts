export type TransactionType = 'order_payment' | 'merchant_payout' | 'rider_payout';
export type TransactionStatus = 'completed' | 'pending' | 'processing' | 'failed';
export type PaymentMethod = 'telebirr' | 'cbe_birr' | 'cash';

export interface TransactionRecord {
  id: string;
  reference: string;
  orderId?: string;
  orderNumber?: string;
  type: TransactionType;
  amount: number;
  fee: number;
  net: number;
  method: PaymentMethod;
  status: TransactionStatus;
  partyName: string;
  partyRole: 'Customer' | 'Merchant' | 'Rider';
  notes?: string;
  createdAt: string;
}
