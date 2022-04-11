import { getGender } from 'gender-detection-from-name';

export function knowMaleOrFemale(nombre: string) {
  return getGender(nombre);
}
