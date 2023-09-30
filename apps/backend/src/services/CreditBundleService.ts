import { CreditBundleDao } from '../dao/CreditBundleDao';
import { CreditBundle, Prisma } from '@prisma/client';

export class CreditBundleService {
  constructor(
    private creditBundleDao: CreditBundleDao = new CreditBundleDao(),
  ) {}

  public async createCreditBundle(
    creditBundleData: Prisma.CreditBundleCreateInput,
  ): Promise<CreditBundle | null> {
    return this.creditBundleDao.createCreditBundle(creditBundleData);
  }

  public async getAllCreditBundles(): Promise<CreditBundle[]> {
    return this.creditBundleDao.getAllCreditBundles();
  }

  public async getCreditBundleById(
    creditBundleId: string,
  ): Promise<CreditBundle | null> {
    return this.creditBundleDao.getCreditBundleById(creditBundleId);
  }

  public async getCreditBundleByName(
    name: string,
  ): Promise<CreditBundle | null> {
    return this.creditBundleDao.getCreditBundleByName(name);
  }

  public async updateCreditBundle(
    creditBundleId: string,
    creditBundleData: Prisma.CreditBundleUpdateInput,
  ): Promise<CreditBundle | null> {
    return this.creditBundleDao.updateCreditBundle(
      creditBundleId,
      creditBundleData,
    );
  }

  public async deleteCreditBundle(
    creditBundleId: string,
  ): Promise<CreditBundle | null> {
    return this.creditBundleDao.deleteCreditBundle(creditBundleId);
  }
}
