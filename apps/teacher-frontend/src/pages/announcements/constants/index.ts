import {
  CreateAnnouncementType,
  LEX_DEFAULT_JSON_STRING,
} from '@acer-academy-learning/data-access';

export const DEFAULT_CREATE_ANNOUNCEMENT_VALUES: Partial<CreateAnnouncementType> =
  {
    title: '',
    message: LEX_DEFAULT_JSON_STRING,
    targetLevels: [],
    targetSubjects: [],
    targetCentres: [],
  };
