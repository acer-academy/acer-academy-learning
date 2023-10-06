import { Prisma, PrismaClient, StripeTransaction } from '@prisma/client';

export class StripeTransactionDao {
  constructor(private prismaClient: PrismaClient = new PrismaClient()) {}

  public async createStripeTransaction(
    stripeTransactionData: Prisma.StripeTransactionCreateInput,
  ): Promise<StripeTransaction> {
    return this.prismaClient.stripeTransaction.create({
      data: stripeTransactionData,
    });
  }

  public async getAllStripeTransactions(): Promise<StripeTransaction[]> {
    return this.prismaClient.stripeTransaction.findMany();
  }

  public async getStripeTransactionById(
    id: string,
  ): Promise<StripeTransaction> {
    return this.prismaClient.stripeTransaction.findUniqueOrThrow({
      where: { id },
    });
  }

  public async getStripeTransactionByPaymentIntentId(
    paymentIntentId: string,
  ): Promise<StripeTransaction> {
    return this.prismaClient.stripeTransaction.findUniqueOrThrow({
      where: { paymentIntentId },
    });
  }

  public async updateStripeTransaction(
    id: string,
    stripeTransactionData: Prisma.StripeTransactionUpdateInput,
  ): Promise<StripeTransaction> {
    return this.prismaClient.stripeTransaction.update({
      where: { id },
      data: stripeTransactionData,
    });
  }
}
