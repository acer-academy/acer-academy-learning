import { SubjectEnum } from '@acer-academy-learning/data-access';

export const getSubjectEnumFromPathParam = (
  subjectString: string,
): SubjectEnum => {
  switch (subjectString) {
    case 'math':
      return SubjectEnum.MATHEMATICS;
    case 'english':
      return SubjectEnum.ENGLISH;
    case 'science':
      return SubjectEnum.SCIENCE;
    default:
      return SubjectEnum.MATHEMATICS;
  }
};
