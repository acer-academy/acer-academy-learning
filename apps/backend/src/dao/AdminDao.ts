// admin.dao.ts
import { PrismaClient } from '@prisma/client';
import { AdminPostData, AdminPutData } from 'libs/data-access/src/lib/types/admin';

const prisma = new PrismaClient();

class AdminDao {
  async createAdmin(data: AdminPostData) {
    return prisma.admin.create({ data });
  }

  async findAdminByEmail(email: string) {
    return prisma.admin.findUnique({ where: { email } });
  }

  async updateAdmin(currentEmail: string, updatedData: AdminPutData) {
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
