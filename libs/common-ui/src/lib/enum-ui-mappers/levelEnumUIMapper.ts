import { LevelEnum } from '@acer-academy-learning/data-access';

export const levelEnumUIMap = new Map<
  LevelEnum,
  { bgColor: string; prettyText: string }
>([
  [LevelEnum.P1, { bgColor: 'bg-adminBlue-50', prettyText: 'Primary 1' }],
  [LevelEnum.P2, { bgColor: 'bg-adminBlue-100', prettyText: 'Primary 2' }],
  [LevelEnum.P3, { bgColor: 'bg-adminBlue-200', prettyText: 'Primary 3' }],
  [LevelEnum.P4, { bgColor: 'bg-adminBlue-300', prettyText: 'Primary 4' }],
  [LevelEnum.P5, { bgColor: 'bg-adminBlue-400', prettyText: 'Primary 5' }],
  [LevelEnum.P6, { bgColor: 'bg-adminBlue-500', prettyText: 'Primary 6' }],
  [LevelEnum.S1, { bgColor: 'bg-adminGreen-50', prettyText: 'Secondary 1' }],
  [LevelEnum.S2, { bgColor: 'bg-adminGreen-100', prettyText: 'Secondary 2' }],
  [LevelEnum.S3, { bgColor: 'bg-adminGreen-200', prettyText: 'Secondary 3' }],
  [LevelEnum.S4, { bgColor: 'bg-adminGreen-300', prettyText: 'Secondary 4' }],
  [LevelEnum.S5, { bgColor: 'bg-adminGreen-400', prettyText: 'Secondary 5' }],
  [
    LevelEnum.J1,
    { bgColor: 'bg-adminBlue-600', prettyText: 'Junior College 1' },
  ],
  [
    LevelEnum.J2,
    { bgColor: 'bg-adminBlue-700', prettyText: 'Junior College 2' },
  ],
]);
