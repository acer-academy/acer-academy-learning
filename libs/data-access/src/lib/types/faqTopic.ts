import { FaqArticleData } from './faqArticle';

export interface FaqTopicCreateData {
  title: string;
}

export interface FaqTopicUpdateData {
  title: string;
}

export interface FaqTopicData {
  id: string;
  title: string;
  faqArticles: FaqArticleData[];
}
