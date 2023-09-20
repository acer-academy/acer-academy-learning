import * as students from './lib/api/student';
import * as centres from './lib/api/centre';

const api = {
  students,
  centres,
};

Object.freeze(api);

export default api;
export * from './lib/data-access';
