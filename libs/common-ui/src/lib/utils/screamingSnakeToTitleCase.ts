export const screamingSnakeToTitleCase = (screamingSnakeStr: string) => {
  return screamingSnakeStr
    .toLowerCase() // Convert everything to lowercase
    .replace(/_./g, (match) => ' ' + match.charAt(1).toUpperCase()) // Replace underscores followed by a character
    .replace(/^./, (match) => match.toUpperCase()); // Capitalize the first character of the string
};
