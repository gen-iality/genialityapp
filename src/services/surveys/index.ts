import { DispatchMessageService } from '@/context/MessageService';
import { fireRealtime, firestore } from '@/helpers/firebase';
import { SurveyInFirestore, SurveyStatus, SurveyStatusDto } from '@/types/survey';

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
	setLoading?: React.Dispatch<React.SetStateAction<boolean>>
) => {
	try {
		// Update status in firebase realtime database & firestore database
		if (setLoading) setLoading(true);
		// const { isOpened, isPublished } = status;
		if (status.isOpened) {
			const statusToUpdated: SurveyStatusDto = {
				...(isOpened && {
					isOpened,
					openedTimestamp: new Date().getTime(),
				}),
			};
		}
		if (status.isPublished) {
			const statusToUpdated: SurveyStatusDto = {
				...(isPublished && {
					isPublished,
					publishedTimestamp: new Date().getTime(),
				}),
			};
		}

		await Promise.all([
			fireRealtime.ref(`events/general/surveys/${surveyId}`).update(status),
			firestore
				.collection('surveys')
				.doc(surveyId)
				.update(status),
		]);
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
