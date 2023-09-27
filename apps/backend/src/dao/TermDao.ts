import { PrismaClient, Prisma, Term } from '@prisma/client';

class TermDao {
  private prisma: PrismaClient;
  constructor() {
    this.prisma = new PrismaClient();
  }

  public async createTerm(input: Prisma.TermCreateInput): Promise<Term> {
    return this.prisma.term.create({ data: { ...input } });
  }

  public async getAllTerms(): Promise<Term[]> {
    return this.prisma.term.findMany();
  }

  public async getTermById(id: string): Promise<Term> {
    return this.prisma.term.findUnique({
      where: { id },
    });
  }

  public async updateTerm(
    id: string,
    input: Prisma.TermUpdateInput,
  ): Promise<Term> {
    return this.prisma.term.update({
      where: { id },
      data: {
        ...input,
      },
    });
  }

  public async deleteTerm(id: string) {
    return this.prisma.term.delete({
      where: { id },
    });
  }
}

export default new TermDao();
