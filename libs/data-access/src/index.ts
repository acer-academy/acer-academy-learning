import * as students from './lib/api/student';

export * from './lib/data-access';

export const api = {
  students,
};

Object.freeze(api);

export { LevelEnum, SubjectEnum, AdminType } from './lib/types/CommonTypes';
export { defaultStudent } from './lib/types/student';
export { loginStudent } from './lib/api/student';
