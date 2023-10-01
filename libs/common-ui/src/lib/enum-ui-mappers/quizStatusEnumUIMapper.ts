import { QuizQuestionStatusEnum } from '@acer-academy-learning/data-access';

export const quizStatusEnumUIMap = new Map<
  QuizQuestionStatusEnum,
  {
    bgColor: string;
    prettyText: string;
    textColor: string;
    borderColor: string;
    svgStyle: string;
  }
>([
  [
    QuizQuestionStatusEnum.READY,
    {
      bgColor: 'bg-indigo-100',
      prettyText: 'Ready',
      textColor: 'text-green-600',
      borderColor: 'border-green-600',
      svgStyle: 'fill-green-600 hover:fill-green-800',
    },
  ],
  [
    QuizQuestionStatusEnum.DRAFT,
    {
      bgColor: 'bg-yellow',
      prettyText: 'Draft',
      textColor: 'text-yellow-600',
      borderColor: 'border-yellow-600',
      svgStyle: 'fill-yellow-600 hover:fill-yellow-800',
    },
  ],
  [
    QuizQuestionStatusEnum.DISABLED,
    {
      bgColor: 'bg-red',
      prettyText: 'Disabled',
      textColor: 'text-red-600',
      borderColor: 'border-red-600',
      svgStyle: 'fill-red-600 hover:fill-red-800',
    },
  ],
]);
