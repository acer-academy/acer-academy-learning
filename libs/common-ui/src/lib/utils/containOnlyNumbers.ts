export const containsOnlyNumbers = (str: string) => {
  return /^-?\d+$/.test(str);
};
