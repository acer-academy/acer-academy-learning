import { FaqTopicDao } from '../dao/FaqTopicDao';
import { FaqTopic, Prisma } from '@prisma/client';

export class FaqTopicService {
  constructor(private faqTopicDao: FaqTopicDao = new FaqTopicDao()) {}

  public async createFaqTopic(
    faqTopicData: Prisma.FaqTopicCreateInput,
  ): Promise<FaqTopic | null> {
    return this.faqTopicDao.createFaqTopic(faqTopicData);
  }

  public async getAllFaqTopics(): Promise<FaqTopic[]> {
    return this.faqTopicDao.getAllFaqTopics();
  }

  public async getFaqTopicById(faqTopicId: string): Promise<FaqTopic | null> {
    return this.faqTopicDao.getFaqTopicById(faqTopicId);
  }

  public async updateFaqTopic(
    faqTopicId: string,
    faqTopicData: Prisma.FaqTopicUpdateInput,
  ): Promise<FaqTopic | null> {
    return this.faqTopicDao.updateFaqTopic(faqTopicId, faqTopicData);
  }

  public async deleteFaqTopic(faqTopicId: string): Promise<FaqTopic | null> {
    return this.faqTopicDao.deleteFaqTopic(faqTopicId);
  }
}
