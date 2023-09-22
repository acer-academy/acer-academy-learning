import { LayoutRole } from '../layout/constants';

export const getThemeClassName = (
  className: string,
  role: LayoutRole,
  isPrimary: boolean,
  shade?: number,
) => {
  return (
    className +
    '-' +
    role +
    '-' +
    (isPrimary ? 'primary' : 'secondary') +
    (shade ? '-' + shade : '')
  );
};
