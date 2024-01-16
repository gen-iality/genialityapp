import app from 'firebase/compat/app';
import { firestore } from '@/helpers/firebase';

class EventAttendeesService {
  constructor(private readonly firestore: app.firestore.Firestore) {}

  async getEventAttendees(eventId: string) {
    const { docs } = await this.firestore
      .collection(`${eventId}_event_attendees`)
      .orderBy('state_id', 'asc')
      .limit(100)
      .get();
    const listEventAttendees = docs.map((doc) => {
      return {
        id: doc.id,
        ...doc.data(),
      };
    });
    console.log('listEventAttendees', listEventAttendees);
  }
}

export const eventAttendeesService = new EventAttendeesService(firestore);
