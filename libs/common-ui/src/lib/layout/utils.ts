export const convertStringToKebabCase = (str: string) => {
  return str
    .split(' ')
    .map((currStr) => currStr.toLocaleLowerCase())
    .join('-');
};

export const convertKebabCaseToUpperCaseString = (str?: string) => {
  return str
    ?.split('-')
    .map((currStr) => currStr.toLocaleUpperCase())
    .join(' ')
    .substring(1);
};

export const convertKebabCaseToUpperCamelCase = (str?: string) => {
  if (str) {
    // Remove '/' in front
    const replaced = str.replace(/^\/+/, '');
    return replaced
      .split('-')
      .map(
        (currStr) => currStr.charAt(0).toLocaleUpperCase() + currStr.slice(1),
      )
      .join(' ');
  }
};
