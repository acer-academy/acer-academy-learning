import {
  CreateAssignmentType,
  LEX_DEFAULT_JSON_STRING,
} from '@acer-academy-learning/data-access';

export const DEFAULT_CREATE_ASSIGNMENT_VALUES: Partial<CreateAssignmentType> = {
  title: '',
  description: LEX_DEFAULT_JSON_STRING,
  levels: [],
};
