/**
 * It takes a number, a singular string, and a plural string, and returns a string that is the number
 * and the singular or plural string, depending on the number
 * @param {number} value - The number to check
 * @param {string} singular - The singular version of the string.
 * @param {string} plural - The plural form of the word.
 * @returns A function that takes in a number, a singular string, and a plural string and returns a
 * string.
 */
export const singularOrPluralString = (value:number, singular:string, plural:string) => {
  if (value === 1) {
    return `${value} ${singular}`;
  } else {
    return `${value} ${plural}`;
  }
};