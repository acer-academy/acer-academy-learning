import { PrismaClient, Prisma, Admin } from '@prisma/client';

const prisma = new PrismaClient();

class AdminDao {
  async createAdmin(data: Prisma.AdminUncheckedCreateInput): Promise<Admin> {
    return prisma.admin.create({ data });
  }

  async getAdminByEmail(email: string): Promise<Admin> {
    return prisma.admin.findUnique({ where: { email } });
  }

  async getAllAdmins(): Promise<Admin[]> {
    return prisma.admin.findMany();
  }

  async getAdminById(id: string): Promise<Admin> {
    return prisma.admin.findUnique({ where: { id } });
  }

  //updateAdminbyId
  async updateAdmin(id: string, updatedData: Prisma.AdminUpdateInput) {
    return prisma.admin.update({
      where: { id },
      data: updatedData,
    });
  }

  async deleteAdmin(id: string) {
    return prisma.admin.delete({ where: { id } });
  }
}

export default new AdminDao();
