import { Prisma, Role, WhitelistItem } from '@prisma/client';
import { WhitelistDao } from '../dao/WhitelistDao';

export class WhitelistService {
  constructor(private whitelistDao: WhitelistDao = new WhitelistDao()) {}

  public async createWhitelist(
    whitelistData: Prisma.WhitelistItemCreateInput,
  ): Promise<WhitelistItem> {
    return this.whitelistDao.createWhitelist(whitelistData);
  }

  public async getAllWhitelist(): Promise<WhitelistItem[]> {
    return this.whitelistDao.getAllWhitelist();
  }

  public async getWhitelistById(whitelistId: string): Promise<WhitelistItem> {
    return this.whitelistDao.getWhitelistById(whitelistId);
  }

  public async getWhitelistByRole(role: Role): Promise<WhitelistItem[]> {
    return this.whitelistDao.getWhitelistByRole(role);
  }

  public async getWhitelistByEmail(
    whitelistEmail: string,
  ): Promise<WhitelistItem | null> {
    return this.whitelistDao.getWhitelistByEmail(whitelistEmail);
  }

  public async isEmailWhitelisted(email: string, role: Role): Promise<boolean> {
    const whitelist = await this.whitelistDao.getWhitelistByEmail(email);
    if (!whitelist) {
      return false;
    }

    if (whitelist.role !== role) {
      return false;
    }

    return true;
  }
  public async getRegisteredWhitelistedUsers(): Promise<WhitelistItem[]> {
    return this.whitelistDao.getRegisteredWhitelistedUsers();
  }

  public async getUnregisteredWhitelistedUsers(): Promise<WhitelistItem[]> {
    return this.whitelistDao.getUnregisteredWhitelistedUsers();
  }

  public async deleteWhitelist(whitelistId: string): Promise<WhitelistItem> {
    const whitelist = await this.whitelistDao.getWhitelistbyIdWithUser(
      whitelistId,
    );
    if (
      whitelist.student !== null ||
      whitelist.teacher !== null ||
      whitelist.admin !== null
    ) {
      throw new Error(
        'Cannot delete whitelist that has associated student/admin/teacher',
      );
    }
    return this.whitelistDao.deleteWhitelist(whitelistId);
  }
}
