import dayjs, { type Dayjs } from 'dayjs'
import { Timestamp } from 'firebase/firestore'

/**
 * This function receives a "date", but if the date is from Firebase maybe you
 * need to parse to a Dayjs object. If the date is from MongoDB maybe you don't
 * have to think more. Anyway, pass the date to this method to be sure that you
 * will have a valid Dayjs object in the best case :)
 *
 * @param date A date.
 * @returns The passed value or a Dayjs object.
 * @featured
 */
export function parseFirebaseDate(date: Dayjs | Timestamp | undefined) {
  let parsedDate: Dayjs | null = null
  if (date instanceof Timestamp) {
    parsedDate = dayjs(new Date(date.seconds * 1000))
  } else if (dayjs(date).isValid()) {
    parsedDate = dayjs(date)
  }

  if (parsedDate === null) {
    return date
  }

  return parsedDate
}
