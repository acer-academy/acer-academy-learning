import { Prisma, PrismaClient, Transaction } from '@prisma/client';

class TransactionDao {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  public async getAllTransactions(): Promise<Transaction[]> {
    return this.prisma.transaction.findMany({
      include: {
        term: true,
        promotion: true,
        student: true,
      },
    });
  }

  public async getTransactionById(id: string): Promise<Transaction> {
    return this.prisma.transaction.findUnique({
      where: { id },
    });
  }

  public async getTransactionsByStudentId(
    studentId: string,
  ): Promise<Transaction[]> {
    return this.prisma.transaction.findMany({
      where: { studentId },
    });
  }

  public async getTransactionsByTermId(termId: string): Promise<Transaction[]> {
    return this.prisma.transaction.findMany({
      where: { termId },
    });
  }

  public async getTransactionsByStudentAndTerm(
    termId: string,
    studentId: string,
  ): Promise<Transaction[]> {
    return this.prisma.transaction.findMany({
      where: { termId, studentId },
    });
  }

  public async createTransaction(
    input: Prisma.TransactionUncheckedCreateInput,
  ): Promise<Transaction> {
    return this.prisma.transaction.create({ data: input });
  }

  public async updateTransaction(
    id: string,
    input: Prisma.TransactionUpdateInput,
  ): Promise<Transaction> {
    return this.prisma.transaction.update({ where: { id }, data: input });
  }
}

export default new TransactionDao();
