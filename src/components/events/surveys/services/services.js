import { firestore } from '@helpers/firebase';

export const Users = {
  getUsers: async (eventId) => {
    const snapshot = await firestore.collection(`${eventId}_event_attendees`).get();
    return snapshot.docs.map((doc) => doc.data());
  },
};
