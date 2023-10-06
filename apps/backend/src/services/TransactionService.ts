import { Prisma, Transaction, TransactionType } from '@prisma/client';
import TransactionDao from '../dao/TransactionDao';
import { StripeTransactionService } from './StripeTransactionService';

const stripeTransactionService = new StripeTransactionService();
class TransactionService {
  public async getAllTransactions(): Promise<Transaction[]> {
    await stripeTransactionService.createTransaction();
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
        case TransactionType.ROLLOVER:
          credits += transaction.creditsTransacted;
          break;
        case TransactionType.DEDUCTED:
        case TransactionType.STRIPE_DEDUCTED:
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

  public async rolloverCredits(
    studentId: string,
    currentTermId: string,
    pastTermId: string,
  ): Promise<Transaction[]> {
    const rollover = await this.getAvailableCredits(pastTermId, studentId);
    const deductTransaction = {
      creditsTransacted: rollover,
      studentId: studentId,
      termId: pastTermId,
      transactionType: TransactionType.DEDUCTED,
    };
    const transactions = [];
    const deduct = await TransactionDao.createTransaction(deductTransaction);
    transactions.push(deduct);
    const rolloverTransaction = {
      ...deductTransaction,
      termId: currentTermId,
      transactionType: TransactionType.ROLLOVER,
      referenceId: deduct.id,
    };
    transactions.push(
      await TransactionDao.createTransaction(rolloverTransaction),
    );
    return transactions;
  }

  public async refundStripeTransaction(id: string): Promise<Transaction> {
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
      transactionType: TransactionType.STRIPE_DEDUCTED,
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
