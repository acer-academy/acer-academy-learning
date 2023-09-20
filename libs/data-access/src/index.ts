// import * as students from './lib/api/student';
// import * as admins from './lib/api/admin';

export * from './lib/data-access';
export * from './lib/api/centre';

// Object.freeze(api);

export { LevelEnum, SubjectEnum, AdminType } from './lib/types/CommonTypes';
export { defaultStudent } from './lib/types/student';
export { loginStudent } from './lib/api/student';
export { defaultAdmin } from './lib/types/admin';
export { loginAdmin } from './lib/api/admin';
export { defaultTeacher } from './lib/types/teacher';
export { loginTeacher } from './lib/api/teacher';
