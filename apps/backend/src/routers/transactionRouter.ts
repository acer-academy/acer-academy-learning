import { Router } from 'express';
import { Prisma } from '@prisma/client';
import TransactionService from '../services/TransactionService';
import {
  validateTransactionComplusoryFields,
  validateTransactionType,
  validatePurchaseTransaction,
} from '../middleware/validationMiddleware';

const transactionRouter = Router();

transactionRouter.get('/', async (req, res) => {
  try {
    const transactions = await TransactionService.getAllTransactions();
    return res.status(200).json(transactions);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
});

transactionRouter.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const transaction = await TransactionService.getTransactionById(id);
    return res.status(200).json(transaction);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
});

transactionRouter.get('/refund/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const transaction = await TransactionService.refundStripeTransaction(id);
    return res.status(200).json(transaction);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
});

transactionRouter.get(
  '/rollover/:studentId/:currentTermId/:prevTermId',
  async (req, res) => {
    try {
      const { studentId, currentTermId, prevTermId } = req.params;
      const transactions = await TransactionService.rolloverCredits(
        studentId,
        currentTermId,
        prevTermId,
      );
      return res.status(200).json(transactions);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: error.message });
    }
  },
);

transactionRouter.get('/student/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const transactions = await TransactionService.getTransactionsByStudentId(
      id,
    );
    return res.status(200).json(transactions);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
});

transactionRouter.get('/term/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const transactions = await TransactionService.getTransactionsByTerm(id);
    return res.status(200).json(transactions);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
});

transactionRouter.get(
  '/availableCredits/:termId/:studentId',
  async (req, res) => {
    try {
      const { termId, studentId } = req.params;
      const credits = await TransactionService.getAvailableCredits(
        termId,
        studentId,
      );
      return res.status(200).json(credits);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: error.message });
    }
  },
);

transactionRouter.post(
  '/',
  validateTransactionType,
  validatePurchaseTransaction,
  validateTransactionComplusoryFields,
  async (req, res) => {
    try {
      const input: Prisma.TransactionUncheckedCreateInput = req.body;
      const transaction = await TransactionService.createTransaction(input);
      return res.status(200).json(transaction);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: error.message });
    }
  },
);

transactionRouter.put('/:id', validateTransactionType, async (req, res) => {
  try {
    const { id } = req.params;
    const input: Prisma.TransactionUncheckedUpdateInput = req.body;
    const transaction = await TransactionService.updateTransaction(id, input);
    return res.status(200).json(transaction);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
});

export default transactionRouter;
