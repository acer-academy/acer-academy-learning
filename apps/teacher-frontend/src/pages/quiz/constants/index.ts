import {
  CreateQuizType,
  LEX_DEFAULT_JSON_STRING,
} from '@acer-academy-learning/data-access';

export const DEFAULT_CREATE_QUIZ_VALUES: Partial<CreateQuizType> = {
  title: '',
  description: LEX_DEFAULT_JSON_STRING,
  topics: [],
};
