// import * as students from './lib/api/student';
// import * as admins from './lib/api/admin';

export * from './lib/data-access';
export * from './lib/api/centre';
export * from './lib/api/classroom';
export * from './lib/api/faqArticle';
export * from './lib/api/faqTopic';
export * from './lib/api/promotion';
export * from './lib/api/notif';
export * from './lib/api/whitelist';

// Object.freeze(api);

export { LevelEnum, SubjectEnum, AdminType } from './lib/types/CommonTypes';
export * from './lib/api/student';
export { loginAdmin, logoutAdmin, fetchAdmin } from './lib/api/admin';
export { loginTeacher, logoutTeacher, fetchTeacher } from './lib/api/teacher';
