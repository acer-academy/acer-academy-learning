import { LevelEnum, SubjectEnum } from '@acer-academy-learning/data-access';
import { Centre, Parent } from 'libs/data-access/src/lib/types/student';

export type ProfileFieldType = {
  label: string;
  value: string | LevelEnum[] | SubjectEnum[] | Centre | Parent[];
  id: string;
  isEditable: boolean;
  onEditMode: boolean;
};
