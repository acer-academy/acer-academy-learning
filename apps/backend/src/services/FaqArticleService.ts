import { FaqArticleDao } from '../dao/FaqArticleDao';
import { FaqArticle, Prisma } from '@prisma/client';

export class FaqArticleService {
  constructor(private faqArticleDao: FaqArticleDao = new FaqArticleDao()) {}

  public async createFaqArticle(
    faqArticleData: Prisma.FaqArticleCreateInput,
  ): Promise<FaqArticle | null> {
    return this.faqArticleDao.createFaqArticle(faqArticleData);
  }

  public async getAllFaqArticles(): Promise<FaqArticle[]> {
    return this.faqArticleDao.getAllFaqArticles();
  }

  public async getFaqArticleById(
    faqArticleId: string,
  ): Promise<FaqArticle | null> {
    return this.faqArticleDao.getFaqArticleById(faqArticleId);
  }

  public async getFaqArticleByFaqTopicId(
    faqTopicId: string,
  ): Promise<FaqArticle[]> {
    return this.faqArticleDao.getFaqArticlesByFaqTopicId(faqTopicId);
  }

  public async updateFaqArticle(
    faqArticleId: string,
    faqArticleData: Prisma.FaqArticleUpdateInput,
  ): Promise<FaqArticle | null> {
    return this.faqArticleDao.updateFaqArticle(faqArticleId, faqArticleData);
  }

  public async deleteFaqArticle(
    faqArticleId: string,
  ): Promise<FaqArticle | null> {
    return this.faqArticleDao.deleteFaqArticle(faqArticleId);
  }
}
