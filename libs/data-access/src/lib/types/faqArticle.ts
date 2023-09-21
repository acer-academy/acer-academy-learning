import { FaqTopicData } from './faqTopic';

export interface FaqArticleCreateData {
  title: string;
  imageUrl: string;
  body: string;
  faqTopic: FaqTopicData;
}

export interface FaqArticleUpdateData {
  title: string;
  imageUrl: string;
  body: string;
  faqTopic: FaqTopicData;
}

export interface FaqArticleData {
  id: string;
  title: string;
  imageUrl: string;
  body: string;
  faqTopic: FaqTopicData;
}
