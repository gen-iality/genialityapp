/**
 * It returns a string that is either singular or plural, depending on the value passed in
 * @param {number} value - The number to check
 * @param {string} singular - The singular version of the string.
 * @param {string} plural - The plural form of the word.
 * @param {boolean} [withValue=true] - boolean = true
 * @returns A function that takes in a number, a singular string, a plural string, and a boolean.
 */
export const singularOrPluralString = (value:number, singular:string, plural:string, hideValue?:boolean ) => {
  if (value === 1) {
    return !hideValue ? `${value} ${singular}` : `${singular}`;
  } else {
    return !hideValue ? `${value} ${plural}` : `${plural}`;
  }
};