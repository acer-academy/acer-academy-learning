import { Centre, Prisma, PrismaClient } from '@prisma/client';

export class CentreDao {
  constructor(private prismaClient: PrismaClient = new PrismaClient()) {}

  public async createCentre(
    centreData: Prisma.CentreCreateInput,
  ): Promise<Centre> {
    return this.prismaClient.centre.create({
      data: centreData,
    });
  }

  public async getAllCentres(): Promise<Centre[]> {
    return this.prismaClient.centre.findMany();
  }

  public async getCentreById(centreId: string): Promise<Centre | null> {
    return this.prismaClient.centre.findUnique({
      where: { id: centreId },
    });
  }

  public async getCentreByName(centreName: string): Promise<Centre | null> {
    return this.prismaClient.centre.findFirst({
      where: { name: centreName },
    });
  }

  public async getCentreByAddress(
    centreAddress: string,
  ): Promise<Centre | null> {
    return this.prismaClient.centre.findFirst({
      where: { address: centreAddress },
    });
  }

  public async updateCentre(
    centreId: string,
    centreData: Prisma.CentreUpdateInput,
  ): Promise<Centre | null> {
    return this.prismaClient.centre.update({
      where: { id: centreId },
      data: centreData,
    });
  }

  public async deleteCentre(centreId: string): Promise<Centre | null> {
    return this.prismaClient.centre.delete({
      where: { id: centreId },
    });
  }
}
