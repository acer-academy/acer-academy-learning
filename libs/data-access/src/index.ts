import * as students from './lib/api/student';
import * as centres from './lib/api/centre';
import * as classrooms from './lib/api/classroom';

const api = {
  students,
  centres,
  classrooms,
};

Object.freeze(api);

export default api;
export * from './lib/data-access';
