/**
 * NOTE: This module can be moved to @Utilities because this mechanism is generic,
 * but now we are going to put here.
 */

import { firestore } from '@helpers/firebase'

type HookCallback = (data: any) => void
type HookType = (eventId: string, activityId: string, cb: HookCallback) => () => void

export const getActivityFirestoreData: HookType = (eventId, activityId, cb) => {
  return firestore
    .collection('events')
    .doc(eventId)
    .collection('activities')
    .doc(activityId)
    .onSnapshot((activitySnapshot) => {
      if (!activitySnapshot.exists) return
      const data = activitySnapshot.data()

      if (typeof cb === 'function') {
        cb(data)
      } else {
        console.error('cb is not a function')
      }
    })
}
