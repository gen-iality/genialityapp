type WishedT = { order?: number; created_at?: any }

/**
 * Sorts an array of activities based on the `order` property and `created_at` timestamp.
 *
 * @param {Array} activities - An array of activities to be sorted.
 * @returns {Array} A sorted array of activities.
 *
 * @description
 * This function takes an array of activities and sorts them in ascending order based on the `order` property
 * if available, or by their `created_at` timestamp if no `order` property is present.
 * Activities with numeric `order` values are sorted in numerical order, while those without an `order`
 * or with non-numeric `order` values are placed at the end of the array.
 * In case of a tie, activities are sorted based on their `created_at` timestamp in ascending order.
 *
 * Note: The original array is not modified; a new sorted array is returned.
 *
 * @example
 * const activities = [
 *   { order: 3, created_at: "2023-08-17T10:00:00Z" },
 *   { order: 1, created_at: "2023-08-17T08:00:00Z" },
 *   { created_at: "2023-08-17T09:00:00Z" },
 *   { order: 2, created_at: "2023-08-17T07:00:00Z" },
 * ];
 *
 * const sortedActivities = orderActivities(activities);
 * console.log(sortedActivities);
 *
 * // Output:
 * // [
 * //   { order: 1, created_at: "2023-08-17T08:00:00Z" },
 * //   { order: 2, created_at: "2023-08-17T07:00:00Z" },
 * //   { order: 3, created_at: "2023-08-17T10:00:00Z" },
 * //   { created_at: "2023-08-17T09:00:00Z" }
 * // ]
 */
export default function orderActivities<T extends WishedT>(activities: T[]) {
  const _activities = [...activities]
  return _activities.sort((a, b) => {
    console.log('abc', a.order, b.order)
    if (typeof a.order === 'number' && typeof b.order === 'number') {
      if (a.order === b.order) return -1
      return a.order - b.order
    } else if (typeof a.order === 'number') {
      return -1
    } else if (typeof b.order === 'number') {
      return 1
    }
    return a.created_at.localeCompare(-b.created_at)
  })
}
