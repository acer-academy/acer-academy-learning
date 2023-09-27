import { Prisma, Transaction, TransactionType } from '@prisma/client';
import TransactionDao from '../dao/TransactionDao';

class TransactionService {
  public async getAllTransactions(): Promise<Transaction[]> {
    return TransactionDao.getAllTransactions();
  }

  public async getTransactionsByStudentId(id: string): Promise<Transaction[]> {
    return TransactionDao.getTransactionsByStudentId(id);
  }

  public async getAvailableCredits(
    termId: string,
    studentId: string,
  ): Promise<number> {
    const transactions = await TransactionDao.getTransactionsByStudentAndTerm(
      termId,
      studentId,
    );
    let credits = 0;
    transactions.map((transaction) => {
      switch (transaction.transactionType) {
        case TransactionType.PURCHASED:
        case TransactionType.REFUNDED:
          credits += transaction.creditsTransacted;
          break;
        case TransactionType.DEDUCTED:
          credits -= transaction.creditsTransacted;
          break;
      }
    });
    return credits;
  }

  public async getTransactionsById(id: string): Promise<Transaction> {
    return TransactionDao.getTransactionsById(id);
  }

  public async getTransactionsByTerm(id: string): Promise<Transaction[]> {
    return TransactionDao.getTransactionsByTermId(id);
  }

  public async createTransaction(
    input: Prisma.TransactionCreateInput,
  ): Promise<Transaction> {
    return TransactionDao.createTransaction(input);
  }

  public async updateTransaction(
    id: string,
    input: Prisma.TransactionUpdateInput,
  ): Promise<Transaction> {
    return TransactionDao.updateTransaction(id, input);
  }
}

export default new TransactionService();
