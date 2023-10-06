export const classNames = (
  ...classes: Array<string | boolean | null | undefined>
) => {
  return classes.filter(Boolean).join(' ');
};
