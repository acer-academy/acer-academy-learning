import { FaqTopic, Prisma, PrismaClient } from '@prisma/client';

export class FaqTopicDao {
  constructor(private prismaClient: PrismaClient = new PrismaClient()) {}

  public async createFaqTopic(
    faqTopicData: Prisma.FaqTopicCreateInput,
  ): Promise<FaqTopic> {
    return this.prismaClient.faqTopic.create({
      data: faqTopicData,
    });
  }

  public async getAllFaqTopics(): Promise<FaqTopic[]> {
    return this.prismaClient.faqTopic.findMany({
      include: {
        faqArticles: true,
      },
    });
  }

  public async getFaqTopicById(faqTopicId: string): Promise<FaqTopic | null> {
    return this.prismaClient.faqTopic.findUnique({
      where: { id: faqTopicId },
      include: {
        faqArticles: true,
      },
    });
  }

  public async getFaqTopicByTitle(title: string): Promise<FaqTopic | null> {
    return this.prismaClient.faqTopic.findUnique({
      where: { title: title },
    });
  }

  public async updateFaqTopic(
    faqTopicId: string,
    faqTopicData: Prisma.FaqTopicUpdateInput,
  ): Promise<FaqTopic | null> {
    return this.prismaClient.faqTopic.update({
      where: { id: faqTopicId },
      data: faqTopicData,
    });
  }

  public async deleteFaqTopic(faqTopicId: string): Promise<FaqTopic | null> {
    const deleteArticles = await this.prismaClient.faqArticle.deleteMany({
      where: {
        faqTopicId: faqTopicId,
      },
    });

    return this.prismaClient.faqTopic.delete({
      where: {
        id: faqTopicId,
      },
    });
  }
}
