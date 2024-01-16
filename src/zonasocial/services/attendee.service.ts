import { firestore } from '@/helpers/firebase';
import { IAttendee } from '..';

export const listeningAttendee = (eventId: string, callback: (attendeeList: any[]) => void) => {
  const collection_name = eventId + '_event_attendees';
  return firestore
    .collection(collection_name)
    .orderBy('state_id', 'asc')
    .limit(100)
    .onSnapshot(function(querySnapshot) {
      const attendeeList: IAttendee[] = [];

      querySnapshot.forEach((doc) => {
        const attendee = doc.data() as Omit<IAttendee, '_id'>;
        attendeeList.push({ _id: doc.id, ...attendee });
      });
      callback(attendeeList);
    });
};
