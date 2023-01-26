import { firestore } from '@/helpers/firebase';
import { Attendee, Survey } from '../types';

export const surveysListener = (
	eventId: string,
	surveys: Survey[],
	setSurveys: React.Dispatch<React.SetStateAction<Survey[]>>
) => {
	return firestore
		.collection('surveys')
		.where('event_id', '==', eventId)
		.onSnapshot(snapshot => {
			if (snapshot.empty) {
				console.log('Docs empty');
			} else {
				console.log('There are docs');
				const surveysSnapshot = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Survey));
				setSurveys(surveysSnapshot);
				console.log('surveysListener -> ', surveys);
			}
		});
};

export const attendeesListener = (
	eventId: string,
	attendees: Attendee[],
	setAttendees: React.Dispatch<React.SetStateAction<Attendee[]>>
) => {
	return firestore.collection(`${eventId}_event_attendees`).onSnapshot(snapshot => {
		if (snapshot.empty) {
			console.log('Docs empty');
		} else {
			console.log('There are docs');
			// if (!attendees.length) {
				const attendeesSnapshot = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Attendee));
				setAttendees(attendeesSnapshot);
			// }
			console.log('attendeesListener -> ', attendees);
		}
	});
};
