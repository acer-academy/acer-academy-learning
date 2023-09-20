import { useMemo } from 'react';
import { LayoutRole } from '../constants';
export const useThemeColorsOnClass = (
  className: string,
  role: LayoutRole,
  isPrimary: boolean,
  shade?: number,
) => {
  const themedClassName = useMemo(
    () =>
      className +
      '-' +
      role +
      '-' +
      (isPrimary ? 'primary' : 'secondary') +
      (shade ? '-' + shade : ''),
    [role, className, isPrimary, shade],
  );

  return themedClassName;
};
