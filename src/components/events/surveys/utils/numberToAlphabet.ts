import { ALPHABET } from "../chartsConfiguration";

export const numberToAlphabet = (number: number) => {
  const orderAlphabet = ALPHABET[number % ALPHABET.length];
  if (number < ALPHABET.length) {
    return orderAlphabet
  } else {
    return orderAlphabet + number;
  }
}