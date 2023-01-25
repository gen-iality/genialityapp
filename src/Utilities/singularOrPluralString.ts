/**
 * It takes a number, a singular string, a plural string, and a boolean. If the number is 1, it returns
 * the singular string with the number prepended to it. If the number is not 1, it returns the plural
 * string with the number prepended to it. If the boolean is true, it returns the singular or plural
 * string without the number prepended to it
 * @param {number} value - The number to check
 * @param {string} singular - The singular version of the string.
 * @param {string} plural - The plural form of the word.
 * @param {boolean} [hideValue] - If true, the value will not be displayed.
 * @returns A function that takes in a number, a singular string, a plural string, and a boolean.
 */
export const singularOrPluralString = (value:number, singular:string, plural:string, hideValue?:boolean ) => {
  if (value === 1) {
    return !hideValue ? `${value} ${singular}` : `${singular}`;
  } else {
    return !hideValue ? `${value} ${plural}` : `${plural}`;
  }
};