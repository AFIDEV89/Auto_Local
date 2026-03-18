"use strict";

export const titleCase = (name) => {
  if (!name) return name;
  return name.slice(0, 1).toUpperCase() + name.slice(1);
};

// export function titleCase(str) {
//   if (!str) return str;
//   return str
//     .toLowerCase() // Convert the string to lowercase
//     .replace(/(?:^|\s)\w/g, match => match.toUpperCase()); // Replace the first character of each word with its uppercase equivalent
// }
