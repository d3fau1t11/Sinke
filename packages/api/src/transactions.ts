import { isDemoSession } from './demo/session';
import { readDemoData } from './demo/store';
import { fetchOrderTransactions, mapOrderPayment } from './orderTransactions';
import type { TransactionRecord } from './transactionTypes';

export type {
  TransactionType,
  TransactionStatus,
  PaymentMethod,
  TransactionRecord,
} from './transactionTypes';

export const transactionsApi = {
  async getAll(): Promise<TransactionRecord[]> {
    if (isDemoSession()) return readDemoData().orders.map((order) => mapOrderPayment(order, true));
    return fetchOrderTransactions();
  },
};
