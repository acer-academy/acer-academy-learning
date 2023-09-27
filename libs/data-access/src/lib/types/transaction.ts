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
}
