// admin.dao.ts
import { PrismaClient } from '@prisma/client';
import { RegisterAdminData, UpdateAdminData } from '../types/admin.type';

const prisma = new PrismaClient();

class AdminDao {
  async createAdmin(data: RegisterAdminData) {
    return prisma.admin.create({ data });
  }

  async findAdminByEmail(email: string) {
    return prisma.admin.findUnique({ where: { email } });
  }

  async updateAdmin(currentEmail: string, updatedData: UpdateAdminData) {
    return prisma.admin.update({
      where: { email: currentEmail },
      data: updatedData,
    });
  }

  async deleteAdmin(email: string) {
    return prisma.admin.delete({ where: { email } });
  }
}

export default new AdminDao();
