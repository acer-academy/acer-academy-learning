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

  public async getTransactionById(id: string): Promise<Transaction> {
    return TransactionDao.getTransactionById(id);
  }

  public async getTransactionsByTerm(id: string): Promise<Transaction[]> {
    return TransactionDao.getTransactionsByTermId(id);
  }

  public async getTransactionsByPromotionId(
    id: string,
  ): Promise<Transaction[]> {
    return TransactionDao.getTransactionsByPromotionId(id);
  }

  public async createTransaction(
    input: Prisma.TransactionUncheckedCreateInput,
  ): Promise<Transaction> {
    return TransactionDao.createTransaction(input);
  }

  public async updateTransaction(
    id: string,
    input: Prisma.TransactionUpdateInput,
  ): Promise<Transaction> {
    return TransactionDao.updateTransaction(id, input);
  }

  public async refundTransaction(id: string): Promise<Transaction> {
    const transaction = await TransactionDao.getTransactionById(id);
    if (transaction.transactionType !== TransactionType.PURCHASED) {
      throw new Error(
        'Transaction is a deduction/refund and cannot be refunded',
      );
    }
    const {
      amount,
      currency,
      creditsTransacted,
      termId,
      studentId,
      promotionId,
    } = transaction;
    const refundTransaction = {
      amount: amount,
      currency: currency,
      creditsTransacted: creditsTransacted,
      termId: termId,
      studentId: studentId,
      promotionId: promotionId,
      transactionType: TransactionType.DEDUCTED,
      reason: 'Manual refund of Stripe Transaction',
    };

    const created = await TransactionDao.createTransaction(refundTransaction);
    TransactionDao.updateTransaction(transaction.id, {
      referenceId: created.id,
    });
    return created;
  }
}

export default new TransactionService();
