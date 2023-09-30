import { CreditBundle, Prisma, PrismaClient } from '@prisma/client';

export class CreditBundleDao {
  constructor(private prismaClient: PrismaClient = new PrismaClient()) {}

  public async createCreditBundle(
    creditBundleData: Prisma.CreditBundleCreateInput,
  ): Promise<CreditBundle> {
    return this.prismaClient.creditBundle.create({
      data: creditBundleData,
    });
  }

  public async getAllCreditBundles(): Promise<CreditBundle[]> {
    return this.prismaClient.creditBundle.findMany();
  }

  public async getCreditBundleById(
    creditBundleId: string,
  ): Promise<CreditBundle | null> {
    return this.prismaClient.creditBundle.findUnique({
      where: { id: creditBundleId },
    });
  }

  public async getCreditBundleByName(
    name: string,
  ): Promise<CreditBundle | null> {
    return this.prismaClient.creditBundle.findUnique({
      where: { name: name },
    });
  }

  public async updateCreditBundle(
    creditBundleId: string,
    creditBundleData: Prisma.CreditBundleUpdateInput,
  ): Promise<CreditBundle | null> {
    return this.prismaClient.creditBundle.update({
      where: { id: creditBundleId },
      data: creditBundleData,
    });
  }

  // Soft delete by setting to inactive
  public async deleteCreditBundle(
    creditBundleId: string,
  ): Promise<CreditBundle | null> {
    return this.prismaClient.creditBundle.update({
      where: { id: creditBundleId },
      data: {
        isActive: false,
      },
    });
  }
}
