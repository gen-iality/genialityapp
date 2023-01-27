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
	const activities = (await AgendaApi.byEvent(eventId)) as ActivitiesResponse;
	return activities.data;
};

interface UsersWhoHaveConnected {
	isOnline: boolean;
	lastChange: number;
	voteWeight?: number;
}

export const listenQuorumByActivity = (
	eventId: string,
	activityId: string,
	setAttendeesState: React.Dispatch<
		React.SetStateAction<{
			online: number;
			visited: number;
			weight: number;
		}>
	>
	// setAttendeesOnline: React.Dispatch<React.SetStateAction<number>>,
	// setAttendeesVisited: React.Dispatch<React.SetStateAction<number>>,
	// setAttendeesOnlineWeight: React.Dispatch<React.SetStateAction<number>>
) => {
	fireRealtime.ref('userStatus/' + eventId + '/' + activityId).on('value', snapshot => {
		const usersWhoHaveConnectedObject: Record<string, UsersWhoHaveConnected> | null = snapshot.val();
		if (!!usersWhoHaveConnectedObject) {
			const usersWhoHaveConnectedArray = Object.keys(usersWhoHaveConnectedObject).map(userId => ({
				id: userId,
				...usersWhoHaveConnectedObject[userId],
			}));
			const usersWhoHaveConnectedQty = usersWhoHaveConnectedArray.length;
			const usersOnline = usersWhoHaveConnectedArray.filter(user => user.isOnline === true);
			const usersOnlineWeight = usersWhoHaveConnectedArray.reduce((acc, user) => {
				if (user.isOnline) {
					acc += user.voteWeight ? Number(user.voteWeight) : 1;
				}
				return acc;
			}, 0);
			const usersOnlineQty = usersOnline.length;
			setAttendeesState({
				online: usersOnlineQty,
				visited: usersWhoHaveConnectedQty,
				weight: usersOnlineWeight,
			});
			// setAttendeesOnline(usersOnlineQty);
			// setAttendeesVisited(usersWhoHaveConnectedQty);
			// setAttendeesOnlineWeight(usersOnlineWeight)
		} else {
			// setAttendeesOnline(0)
			// setAttendeesVisited(0)
			// setAttendeesOnlineWeight(0)
			setAttendeesState({
				online: 0,
				visited: 0,
				weight: 0,
			});
		}
	});
};
