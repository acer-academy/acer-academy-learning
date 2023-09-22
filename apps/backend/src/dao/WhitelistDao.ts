import { Prisma, PrismaClient, Role, WhitelistItem } from '@prisma/client';
import { WhitelistWithUser } from '../types/whitelist';

export class WhitelistDao {
  constructor(private prismaClient: PrismaClient = new PrismaClient()) {}

  public async createWhitelist(
    whitelistData: Prisma.WhitelistItemCreateInput,
  ): Promise<WhitelistItem> {
    return this.prismaClient.whitelistItem.create({
      data: whitelistData,
    });
  }

  public async getAllWhitelist(): Promise<WhitelistItem[]> {
    return this.prismaClient.whitelistItem.findMany({
      include: { student: true, teacher: true, admin: true },
    });
  }

  public async getWhitelistById(whitelistId: string): Promise<WhitelistItem> {
    return this.prismaClient.whitelistItem.findUniqueOrThrow({
      where: { id: whitelistId },
      include: { student: true, teacher: true, admin: true },
    });
  }

  public async getWhitelistByRole(role: Role): Promise<WhitelistItem[]> {
    return this.prismaClient.whitelistItem.findMany({
      where: { role: role },
      include: { student: true, teacher: true, admin: true },
    });
  }

  public async getWhitelistByEmail(
    email: string,
  ): Promise<WhitelistItem | null> {
    return this.prismaClient.whitelistItem.findUnique({
      where: { email: email },
    });
  }

  public async getWhitelistByEmailWithUser(
    email: string,
  ): Promise<WhitelistWithUser> {
    return this.prismaClient.whitelistItem.findUniqueOrThrow({
      where: { email: email },
      include: { student: true, teacher: true, admin: true },
    });
  }

  public async deleteWhitelist(whitelistId: string): Promise<WhitelistItem> {
    return this.prismaClient.whitelistItem.delete({
      where: {
        id: whitelistId,
      },
    });
  }

  public async getRegisteredWhitelistedUsers(): Promise<WhitelistItem[]> {
    return this.prismaClient.whitelistItem.findMany({
      where: {
        OR: [
          {
            student: {
              NOT: null,
            },
          },
          {
            teacher: {
              NOT: null,
            },
          },
          {
            admin: {
              NOT: null,
            },
          },
        ],
      },
      include: {
        student: true,
        teacher: true,
        admin: true,
      },
    });
  }

  public async getUnregisteredWhitelistedUsers(): Promise<WhitelistItem[]> {
    return this.prismaClient.whitelistItem.findMany({
      where: {
        AND: [
          {
            student: null,
          },
          {
            teacher: null,
          },
          {
            admin: null,
          },
        ],
      },
    });
  }
}
