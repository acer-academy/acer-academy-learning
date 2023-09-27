import { StudentData } from './student';

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
}

export interface TermData {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
}
