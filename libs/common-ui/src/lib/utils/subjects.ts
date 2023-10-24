import { SubjectEnum } from '@acer-academy-learning/data-access';

export type SubjectWithMetaData = {
  title: string;
  subject: SubjectEnum;
  path: string;
};

export const getSubjectPathFrom = (
  subject: SubjectEnum,
): SubjectWithMetaData => ({
  title:
    subject.slice(0, 1).toLocaleUpperCase() +
    subject.substring(1).toLocaleLowerCase(),
  subject: subject,
  path: subject.toLocaleLowerCase(),
});

export const getSubjectEnumFromPathParam = (
  subjectString: string,
): SubjectEnum | undefined => {
  return Object.values(SubjectEnum).find(
    (val) => val.toLocaleLowerCase() === subjectString,
  );
};
