/**
 * NOTE: This module can be moved to @Utilities because this mechanism is generic,
 * but now we are going to put here.
 */

import { FB } from '@helpers/firestore-request'

type HookCallback = (data: any) => void
type HookType = (eventId: string, activityId: string, cb: HookCallback) => void

export const getActivityFirestoreData: HookType = (eventId, activityId, cb) => {
  FB.Activities.ref(eventId, activityId).onSnapshot((activitySnapshot) => {
    if (!activitySnapshot.exists) {
      console.warn(
        `firebase cannot find the activity for event ID: ${eventId}, activity ID: ${activityId}`,
      )
      return
    }
    const data = activitySnapshot.data()

    if (typeof cb === 'function') {
      cb(data)
    } else {
      console.error('cb is not a function')
    }
  })
}
