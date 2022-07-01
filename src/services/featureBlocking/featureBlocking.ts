import { firestore } from '@/helpers/firebase';

export const featureBlockingListener = (eventId: string, helperDispatch: ({}) => void) => {
  if (!eventId) return;

  const refToEvent = firestore.collection('events');

  refToEvent.doc(eventId).onSnapshot((event) => {
    if (event.exists) {
      const eventIsActive = event.data()?.eventIsActive;
      // console.log('🚀 eventIsActive =>  ', eventIsActive);
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
