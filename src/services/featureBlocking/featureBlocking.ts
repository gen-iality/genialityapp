import { FB } from '@helpers/firestore-request'

export const featureBlockingListener = (
  eventId: string,
  helperDispatch: ({}) => void,
  isMap: string,
) => {
  if (!eventId) return

  FB.Events.ref(eventId).onSnapshot((event) => {
    if (event.exists) {
      const eventIsActive = true //event.data()?.eventIsActive
      if (isMap === 'map') {
        helperDispatch({ type: 'eventIsActive', eventIsActive, eventId })
        return
      }
      helperDispatch({ type: 'eventIsActive', eventIsActive })
      return
    }
  })
}

export const featureBlockingStatusSave = (eventId: string, state: boolean) => {
  FB.Events.edit(
    eventId,
    {
      eventIsActive: true, //state,
    },
    { merge: true },
  )
    .then()
    .catch((error) => {
      console.error('firebase error: ', error)
    })
}
