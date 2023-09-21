import { FaqTopicData } from './faqTopic';

export interface FaqArticleCreateData {
  title: string;
  imageUrl: string;
  body: string;
  faqTopicId: string;
}

export interface FaqArticleUpdateData {
  title: string;
  imageUrl: string;
  body: string;
  faqTopicId: string;
}

export interface FaqArticleData {
  id: string;
  title: string;
  imageUrl: string;
  body: string;
  faqTopic: FaqTopicData;
}
