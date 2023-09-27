import { Prisma, Term } from '@prisma/client';
import TermDao from '../dao/TermDao';

class TermService {
  public async createTerm(input: Prisma.TermCreateInput): Promise<Term> {
    return TermDao.createTerm(input);
  }

  public async updateTerm(
    id: string,
    data: Prisma.TermUpdateInput,
  ): Promise<Term> {
    return TermDao.updateTerm(id, data);
  }

  public async getAllTerms(): Promise<Term[]> {
    return TermDao.getAllTerms();
  }

  public async getTermById(id: string): Promise<Term> {
    return TermDao.getTermById(id);
  }

  public async deleteTerm(id: string): Promise<Term> {
    return TermDao.deleteTerm(id);
  }
}

export default new TermService();
