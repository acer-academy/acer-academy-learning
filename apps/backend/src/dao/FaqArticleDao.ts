import { FaqArticle, Prisma, PrismaClient } from '@prisma/client';

export class FaqArticleDao {
  constructor(private prismaClient: PrismaClient = new PrismaClient()) {}

  public async createFaqArticle(
    faqArticleData: Prisma.FaqArticleCreateInput,
  ): Promise<FaqArticle> {
    return this.prismaClient.faqArticle.create({
      data: faqArticleData,
    });
  }

  public async getAllFaqArticles(): Promise<FaqArticle[]> {
    return this.prismaClient.faqArticle.findMany();
  }

  public async getFaqArticleById(
    faqArticleId: string,
  ): Promise<FaqArticle | null> {
    return this.prismaClient.faqArticle.findUnique({
      where: { id: faqArticleId },
    });
  }

  public async getFaqArticleByFaqTopic(
    faqTopicId: string,
  ): Promise<FaqArticle[] | null> {
    return this.prismaClient.faqArticle.findMany({
      where: { faqTopicId: faqTopicId },
    });
  }

  public async updateFaqArticle(
    faqArticleId: string,
    faqArticleData: Prisma.FaqArticleUpdateInput,
  ): Promise<FaqArticle | null> {
    return this.prismaClient.faqArticle.update({
      where: { id: faqArticleId },
      data: faqArticleData,
    });
  }

  public async deleteFaqArticle(
    faqArticleId: string,
  ): Promise<FaqArticle | null> {
    return this.prismaClient.faqArticle.delete({
      where: { id: faqArticleId },
    });
  }
}
