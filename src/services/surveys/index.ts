import { Attendee } from '@/components/assembly/types';
import { DispatchMessageService } from '@/context/MessageService';
import { fireRealtime, firestore } from '@/helpers/firebase';
import { SurveyInFirestore, SurveyStatus, SurveyStatusDto, UsersWhoHaveConnected } from '@/types/survey';
import { numberDecimalToTwoDecimals } from '@/Utilities/numberDecimalToTwoDecimals';

export const listenSurveysByEvent = (
	eventId: string,
	setSurveys?: React.Dispatch<React.SetStateAction<SurveyInFirestore[]>>
) => {
	return firestore
		.collection('surveys')
		.where('eventId', '==', eventId)
		.onSnapshot(
			snapshot => {
				const surveys = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as SurveyInFirestore));
				if (setSurveys) setSurveys(surveys);
			},
			onError => {
				console.error(onError);
			}
		);
};

export const listenSurveysByActivity = (
	eventId: string,
	activityId: string,
	setSurveys?: React.Dispatch<React.SetStateAction<SurveyInFirestore[]>>
) => {
	return firestore
		.collection('surveys')
		.where('eventId', '==', eventId)
		.where('activity_id', '==', activityId)
		.onSnapshot(
			snapshot => {
				const surveys = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as SurveyInFirestore));
				if (setSurveys) setSurveys(surveys);
			},
			onError => {
				console.error(onError);
			}
		);
};

export const changeSurveyStatus = async (
	surveyId: SurveyInFirestore['id'],
	status: SurveyStatus,
	eventId: string,
	activityId?: string,
	setLoading?: React.Dispatch<React.SetStateAction<boolean>>
) => {
	try {
		let statusToUpdated: SurveyStatusDto = {} as SurveyStatusDto;
		// Update status in firebase realtime database & firestore database
		if (setLoading) setLoading(true);
		// Get Quorum if activity Id exists
		let quorum = 0;
		if (eventId && activityId) {
			quorum = await getQuorumByActivity(eventId, activityId)
		}
		if (Object.keys(status).includes('isOpened') && status.isOpened !== undefined) {
			if (status.isOpened) {
				statusToUpdated = {
					isOpened: status.isOpened,
					openedTimestamp: new Date().getTime(),
					openedQuorum: quorum
				};
			} else {
				statusToUpdated = {
					isOpened: status.isOpened,
					closedTimestamp: new Date().getTime(),
					closedQuorum: quorum
				};
			}
		}
		if (Object.keys(status).includes('isPublished') && status.isPublished !== undefined) {
			statusToUpdated = {
				isPublished: status.isPublished,
			};
		}
		console.log('Realtime', `events/general/surveys/${surveyId}`);
		console.log('Firestore', `surveys/${surveyId}`);
		if (Object.keys(statusToUpdated).length) {
			await Promise.all([
				fireRealtime.ref(`events/general/surveys/${surveyId}`).update(statusToUpdated),
				firestore
					.collection('surveys')
					.doc(surveyId)
					.update(statusToUpdated),
			]);
		}

		DispatchMessageService({
			type: 'success',
			msj: 'Encuesta actualizada',
			action: 'show',
		});
	} catch (error) {
		console.error(error);
		DispatchMessageService({
			type: 'error',
			msj: 'Error al actualizar la encuesta',
			action: 'show',
		});
	} finally {
		if (setLoading) setLoading(false);
	}
};

export const getQuorumByActivity = async (eventId: string, activityId: string) => {
	// Getting users online by activity
	const [snapshot, attendees] = await Promise.all([
		await fireRealtime.ref('userStatus/' + eventId + '/' + activityId).get(),
		await getAttendeesByEvent(eventId)
	])
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
		const attendeesState = {
			online: usersOnlineQty,
			visited: usersWhoHaveConnectedQty,
			weight: usersOnlineWeight,
		};
		const totalAttendeesWeight = attendees.reduce((acc, attendee) => {
			if (attendee.properties.voteWeight) {
				acc += attendee.properties.voteWeight ? Number(attendee.properties.voteWeight) : 1;
			} else {
				acc += 1
			}
			return acc;
		}, 0);
		if (!attendeesState.weight || !totalAttendeesWeight) {
			return 0
		} else {
			const quorum = numberDecimalToTwoDecimals((attendeesState.weight / totalAttendeesWeight) * 100);
			return quorum;
		}
	}
	return 0
};

const getAttendeesByEvent = async (eventId: string) => {
	const snapshot = await firestore.collection(`${eventId}_event_attendees`).get();
	if (snapshot.empty) {
		return [] as Attendee[];
	} else {
		const attendeesSnapshot = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Attendee));
		return attendeesSnapshot;
	}
};
