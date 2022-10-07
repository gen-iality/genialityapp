import { firestore } from '@helpers/firebase';

export const featureBlockingListener = (eventId: string, helperDispatch: ({}) => void, isMap: string) => {
  if (!eventId) return;

  const refToEvent = firestore.collection('events');

  refToEvent.doc(eventId).onSnapshot((event) => {
    if (event.exists) {
      const eventIsActive = event.data()?.eventIsActive;
      if (isMap === 'map') {
        helperDispatch({ type: 'eventIsActive', eventIsActive, eventId });
        return;
      }
      helperDispatch({ type: 'eventIsActive', eventIsActive });
      return;
    }
  });
};

export const featureBlockingStatusSave = (eventId: string, state: boolean) => {
  const refToEvent = firestore.collection('events');

  refToEvent
    .doc(eventId)
    .set(
      {
        eventIsActive: state,
      },
      { merge: true }
    )
    .then(() => {})
    .catch((error) => {
      console.error('firebase error: ', error);
    });
};
