import { StripeTransactionStatus } from './CommonTypes';
import { StudentData } from './student';

export interface StripeTransactionData {
  id: string;
  paymentIntentId: string;
  amount: number;
  status: StripeTransactionStatus;
  receiptUrl?: string;
}
export interface TransactionData {
  id: string;
  amount: number;
  currency: string;
  dateTime: string;
  creditsTransacted: number;
  transactionType: string;
  reason: string | null;
  termId: string;
  studentId: string;
  promotionId: string | null;
  student: StudentData;
  referenceId: string | null;
  term: TermData;
  stripeTransactionId?: string;
  stripeTransaction?: StripeTransactionData;
}

export interface TermData {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
}

export interface TransactionCreateData {
  amount: number;
  currency: string;
  creditsTransacted: number;
  transactionType: string;
  studentId: string;
  creditBundleIdArray: string[];
}
