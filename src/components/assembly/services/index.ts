import { firestore } from '@/helpers/firebase';
import { SurveysApi } from '@/helpers/request';
import { SurveysResponse } from '../types';

export const getAllSurveys = async (eventId: string) => {
	const response = (await SurveysApi.getAll(eventId)) as SurveysResponse;
	return response;
};

export const surveysListener = (eventId: string) => {
	return firestore
		.collection('surveys')
		.where('event_id', '==', eventId)
		.onSnapshot(snapshot => {
			if (snapshot.empty) {
				console.log('Docs empty');
			} else {
        console.log('There are docs')
      }
		});
};
