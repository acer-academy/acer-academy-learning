// admin.dao.ts
import { PrismaClient, Prisma, Admin } from '@prisma/client';
import {
  AdminPostData,
  AdminPutData,
} from 'libs/data-access/src/lib/types/admin';

const prisma = new PrismaClient();

class AdminDao {
  async createAdmin(data: Prisma.AdminUncheckedCreateInput): Promise<Admin> {
    return prisma.admin.create({ data });
  }

  async getAdminByEmail(email: string) {
    return prisma.admin.findUnique({ where: { email } });
  }

  async getAllAdmins(): Promise<Admin[]> {
    return prisma.admin.findMany();
  }

  async getAdminById(id: string) {
    return prisma.admin.findUnique({ where: { id } });
  }

  //updateAdminbyId
  async updateAdmin(id: string, updatedData: Prisma.AdminUpdateInput) {
    return prisma.admin.update({
      where: { id },
      data: updatedData,
    });
  }

  async deleteAdmin(email: string) {
    return prisma.admin.delete({ where: { email } });
  }
}

export default new AdminDao();
