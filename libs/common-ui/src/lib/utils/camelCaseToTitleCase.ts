export const camelCaseToTitleCase = (camelStr: string): string => {
  const result = camelStr
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2') // Split on the camelCase
    .replace(/^./, (str) => str.toUpperCase()); // Capitalize the first letter

  return result
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};
