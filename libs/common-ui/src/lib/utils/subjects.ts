import { SubjectEnum } from '@acer-academy-learning/data-access';

export type SubjectWithMetaData = {
  title: string;
  subject: SubjectEnum;
  path: string;
};

export const getSubjectPathFrom = (
  subject: SubjectEnum,
  subjectPrefixPath: string,
): SubjectWithMetaData => ({
  title:
    subject.slice(0, 1).toLocaleUpperCase() +
    subject.substring(1).toLocaleLowerCase(),
  subject: subject,
  path: subjectPrefixPath + '/' + subject.toLocaleLowerCase(),
});
