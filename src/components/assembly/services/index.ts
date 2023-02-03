import { GraphicsData, VoteResponse } from '@/components/events/surveys/types';
import { getAssemblyGraphicsData } from '@/components/events/surveys/utils/getAssemblyGraphicsData';
import { fireRealtime, firestore } from '@/helpers/firebase';
import { AgendaApi, SurveysApi } from '@/helpers/request';
import { ActivitiesResponse, Attendee, GraphicTypeResponse, Question, Survey } from '../types';

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
			} else {
				const surveysSnapshot = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Survey));
				setSurveys(surveysSnapshot);
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
		} else {
			const attendeesSnapshot = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Attendee));
			setAttendees(attendeesSnapshot);
			
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

export const listenAnswersQuestion = (
	surveyId: string,
	questionId: string,
	eventId: string,
	setGraphicsData: React.Dispatch<React.SetStateAction<GraphicsData>>,
	setResponses?: React.Dispatch<React.SetStateAction<VoteResponse[]>>
) => {
	return firestore
		.collection('surveys')
		.doc(surveyId)
		.collection('answers')
		.doc(questionId)
		.collection('responses')
		.orderBy('created', 'asc')
		.onSnapshot(
			snapshot => {
				const answers = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as VoteResponse));
				if (setResponses) setResponses(answers);
				const { dataValues, labels } = getAssemblyGraphicsData(answers);
				const labelsToShow = labels.map(label => label.complete);
				setGraphicsData({
					dataValues,
					labels,
					labelsToShow,
				});
			},
			onError => {
				console.log(onError);
			}
		);
};

// export const getQuestionsBySurvey = async (eventId: string, surveyId: string) => {
export const getAdditionalDataBySurvey = async (eventId: string, surveyId: string) => {
	const response = await SurveysApi.getOne(eventId, surveyId);
	return {
		questions: response.questions as Question[],
		graphicType: (response.graphyType ? response.graphyType : 'pie') as GraphicTypeResponse,
	};
};

export const getCountResponses = (
	surveyId: string,
	questionId: string,
	setResponses: React.Dispatch<React.SetStateAction<VoteResponse[]>>,
	setLoading?: React.Dispatch<React.SetStateAction<boolean>>
) => {
	return firestore
		.collection('surveys')
		.doc(surveyId)
		.collection('answers')
		.doc(questionId)
		.collection('responses')
		.onSnapshot(
			snapshot => {
				const answers = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as VoteResponse));
				if (setResponses) setResponses(answers);
				if (setLoading) setLoading(false)
			},
			onError => {
				console.log(onError);
			}
		);
};
