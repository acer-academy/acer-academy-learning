// import * as students from './lib/api/student';
// import * as admins from './lib/api/admin';

export * from './lib/data-access';

// Object.freeze(api);

export { LevelEnum, SubjectEnum, AdminType } from './lib/types/CommonTypes';
export { loginStudent, logoutStudent, fetchStudent } from './lib/api/student';
export { loginAdmin, logoutAdmin, fetchAdmin } from './lib/api/admin';
export { loginTeacher, logoutTeacher, fetchTeacher } from './lib/api/teacher';
