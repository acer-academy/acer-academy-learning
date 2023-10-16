import { Class, Prisma, PrismaClient } from '@prisma/client';

class ClassDao {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  public async createClass(
    input: Prisma.ClassUncheckedCreateInput,
  ): Promise<Class> {
    return this.prisma.class.create({ data: input });
  }

  public async getAllClasses(): Promise<Class[]> {
    return this.prisma.class.findMany();
  }

  public async getClassById(id: string): Promise<Class> {
    return this.prisma.class.findUnique({
      where: { id },
      include: { sessions: true },
    });
  }

  public async updateClass(
    id: string,
    input: Prisma.ClassUncheckedUpdateInput,
  ): Promise<Class> {
    return this.prisma.class.update({ where: { id }, data: input });
  }

  public async deleteClass(id: string) {
    return this.prisma.class.delete({ where: { id } });
  }
}

export default new ClassDao();
