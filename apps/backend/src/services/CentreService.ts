import { CentreDao } from '../dao/CentreDao';
import { Centre, Prisma } from '@prisma/client';

export class CentreService {
  constructor(private centreDao: CentreDao = new CentreDao()) {}

  public async createCentre(
    centreData: Prisma.CentreCreateInput,
  ): Promise<Centre | null> {
    return this.centreDao.createCentre(centreData);
  }

  public async getAllCentres(): Promise<Centre[]> {
    return this.centreDao.getAllCentres();
  }

  public async getCentreByName(centreName: string): Promise<Centre | null> {
    return this.centreDao.getCentreByName(centreName);
  }

  public async getCentreByAddress(
    centreAddress: string,
  ): Promise<Centre | null> {
    return this.centreDao.getCentreByAddress(centreAddress);
  }

  public async getCentreById(centreId: string): Promise<Centre | null> {
    return this.centreDao.getCentreById(centreId);
  }

  public async updateCentre(
    centreId: string,
    centreData: Prisma.CentreUpdateInput,
  ): Promise<Centre | null> {
    return this.centreDao.updateCentre(centreId, centreData);
  }

  public async deleteCentre(centreId: string): Promise<Centre | null> {
    return this.centreDao.deleteCentre(centreId);
  }
}
