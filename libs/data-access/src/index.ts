import * as students from './lib/api/student';

const api = {
  students,
};

Object.freeze(api);

export default api;
export * from './lib/data-access';
