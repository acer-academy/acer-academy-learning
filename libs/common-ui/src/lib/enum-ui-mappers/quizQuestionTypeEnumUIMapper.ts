import { QuizQuestionTypeEnum } from '@acer-academy-learning/data-access';

export const typeEnumUIMap = new Map<
  QuizQuestionTypeEnum,
  { bgColor: string; prettyText: string }
>([
  [QuizQuestionTypeEnum.MCQ, { bgColor: 'bg-slate-200', prettyText: 'MCQ' }],
  [QuizQuestionTypeEnum.MRQ, { bgColor: 'bg-slate-300', prettyText: 'MRQ' }],
  [QuizQuestionTypeEnum.TFQ, { bgColor: 'bg-slate-100', prettyText: 'TFQ' }],
  [
    QuizQuestionTypeEnum.OPEN_ENDED,
    { bgColor: 'bg-slate-400', prettyText: 'Open Ended' },
  ],
]);
