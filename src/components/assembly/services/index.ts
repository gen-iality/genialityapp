import { fireRealtime, firestore } from '@/helpers/firebase';
import { AgendaApi } from '@/helpers/request';
import { ActivitiesResponse, Attendee, Survey } from '../types';

export const surveysListener = (
	eventId: string,
	surveys: Survey[],
	setSurveys: React.Dispatch<React.SetStateAction<Survey[]>>
) => {
	return firestore
		.collection('surveys')
		.where('eventId', '==', eventId)
		.onSnapshot(snapshot => {
			if (snapshot.empty) {
				console.log('surveysListener -> Docs empty');
			} else {
				console.log('surveysListener -> There are docs');
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

export const getActivities = async (eventId: string) => {
	const activities = (await AgendaApi.byEvent(eventId)) as ActivitiesResponse
	return activities.data
}

export const listenQuorumByActivity = (eventId: string, activityId: string) => {
	return fireRealtime.ref('userStatus/' + eventId + '/' + activityId).on('child_changed', snapshot => {
		console.log(snapshot.numChildren())
	})
}