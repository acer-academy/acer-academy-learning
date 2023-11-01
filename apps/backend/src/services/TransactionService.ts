import { Prisma, Transaction, TransactionType } from '@prisma/client';
import TransactionDao from '../dao/TransactionDao';
import { StripeTransactionService } from './StripeTransactionService';
import { TermService } from './TermService';

const stripeTransactionService = new StripeTransactionService();
const termService = new TermService();

class TransactionService {
  public async createTransaction(
    input: Prisma.TransactionUncheckedCreateInput,
  ): Promise<Transaction> {
    const currentTerms = await termService.getCurrentTerms();
    const currentTerm = currentTerms[0];

    const creditTransaction = await TransactionDao.createTransaction({
      ...input,
      currency: 'sgd',
      termId: currentTerm.id,
    });

    if (creditTransaction.transactionType === TransactionType.PURCHASED) {
      const stripeTransaction =
        await stripeTransactionService.createStripeTransaction(
          creditTransaction,
        );

      if (!stripeTransaction) {
        throw new Error('Stripe Transaction not created');
      } else {
        await TransactionDao.updateTransaction(creditTransaction.id, {
          stripeTransactionId: stripeTransaction.id,
        });
      }
    }

    return creditTransaction;
  }

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
        case TransactionType.ROLLOVER:
        case TransactionType.CREDIT_REFUND:
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

  public async getTransactionsByAttendanceId(
    id: string,
  ): Promise<Transaction[]> {
    return TransactionDao.getTransactionsByAttendanceId(id);
  }

  public async updateTransaction(
    id: string,
    input: Prisma.TransactionUncheckedUpdateInput,
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
      reason: 'Deducted for rollover to next term',
    };
    const transactions = [];
    // create deduction
    const deduct = await TransactionDao.createTransaction(deductTransaction);
    transactions.push(deduct);

    // create rollover
    const rolloverTransaction = {
      ...deductTransaction,
      reason: 'Rollover from previous term',
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
    const creditTransaction = await TransactionDao.getTransactionById(id);
    if (creditTransaction.transactionType !== TransactionType.PURCHASED) {
      throw new Error(
        'Transaction is a deduction/refund and cannot be refunded',
      );
    }

    const refundTransactionInput = {
      amount: creditTransaction.amount,
      currency: 'SGD',
      creditsTransacted: creditTransaction.creditsTransacted,
      termId: creditTransaction.termId,
      studentId: creditTransaction.studentId,
      transactionType: TransactionType.STRIPE_DEDUCTED,
      reason: 'Manual deduction due to refund of Stripe Transaction',
    };

    const stripeTransactionId = creditTransaction.stripeTransactionId;
    const stripeTransaction =
      await stripeTransactionService.getStripeTransactionById(
        stripeTransactionId,
      );

    if (stripeTransaction.status === 'REFUNDED') {
      throw new Error('Stripe Transaction has already been refunded');
    }

    // api call to stripe to refund transaction
    await stripeTransactionService.refundStripeTransaction(
      stripeTransaction.paymentIntentId,
      creditTransaction.amount,
    );

    // creating credit transaction in db
    const refundedTransaction = await TransactionDao.createTransaction({
      ...refundTransactionInput,
      stripeTransactionId: stripeTransaction.id,
    });

    TransactionDao.updateTransaction(creditTransaction.id, {
      referenceId: refundedTransaction.id,
    });

    return refundedTransaction;
  }
}

export default new TransactionService();
