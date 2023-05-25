import { firestore, fireRealtime } from '../../../../helpers/firebase';
import { SurveysApi } from '../../../../helpers/request';
import { GraphicsData, VoteResponse } from '../types';
import { getAssemblyGraphicsData } from '../utils/getAssemblyGraphicsData';
import countAnswers from './counstAnswersService';

const surveyAnswers = {
	// Servicio para registrar votos para un usuario logeado
	registerWithUID: async (surveyId: string, questionId: string, dataAnswer: any, counter: any) => {
		const { responseData, date, uid, email, names, voteWeight } = dataAnswer;
		const { optionQuantity, optionIndex, correctAnswer } = counter;
		const data = {
			response: responseData || '',
			created: date,
			id_user: uid,
			user_email: email,
			user_name: names,
			id_survey: surveyId,
			voteWeight: Number(voteWeight) || 1,
		};

		if (correctAnswer !== undefined) {
			// @ts-ignore
			data['correctAnswer'] = correctAnswer;
		}

		if (responseData && responseData?.length > 0) {
			countAnswers(surveyId, questionId, optionQuantity, optionIndex, voteWeight);
		}

		await firestore
			.collection('surveys')
			.doc(surveyId)
			.collection('answers')
			.doc(questionId)
			.collection('responses')
			.doc(uid)
			.set(data);
	},
	// Servicio para registrar votos para un usuario sin logeo
	registerLikeGuest: async (surveyId: string, questionId: string, dataAnswer: any, counter: any) => {
		const { responseData, date, uid } = dataAnswer;
		const { optionQuantity, optionIndex, correctAnswer } = counter;

		let data =
			correctAnswer !== undefined
				? {
						response: responseData,
						created: date,
						id_user: uid,
						id_survey: surveyId,
						correctAnswer,
				  }
				: {
						response: responseData,
						created: date,
						id_user: uid,
						id_survey: surveyId,
				  };

		countAnswers(surveyId, questionId, optionQuantity, optionIndex);

		return new Promise((resolve, reject) => {
			firestore
				.collection('surveys')
				.doc(surveyId)
				.collection('answers')
				.doc(questionId)
				.collection('responses')
				.add(data)
				.then(() => {
					resolve('Las respuestas han sido enviadas');
				})
				.catch(err => {
					reject(err);
				});
		});
	},
	// Servicio para obtener el conteo de las respuestas y las opciones de las preguntas
	getAnswersQuestion: async (
		surveyId: string,
		questionId: string,
		eventId: string,
		updateData: any,
		operation: string
	) => {
		// eslint-disable-next-line no-unused-vars
		let dataSurvey = await SurveysApi.getOne(eventId, surveyId);
		let options = dataSurvey.questions.find((question: any) => question.id === questionId);
		let optionsIndex = dataSurvey.questions.findIndex((index: any) => index.id === questionId);
		const realTimeRef = fireRealtime.ref(`surveys/${surveyId}/answer_count/${questionId}`);

		realTimeRef.on('value', listResponse => {
			if (listResponse.exists()) {
				let result: any[] = [];
				let total = 0;
				result = listResponse.val();
				switch (operation) {
					case 'onlyCount':
						Object.keys(result).forEach((item: any) => {
							if (Number.isInteger(parseInt(item)) && Number.isInteger(result[item])) {
								if (parseInt(item) >= 0) {
									result[item] = [result[item]];
								}
							}
						});
						break;

					case 'participationPercentage':
						Object.keys(result).forEach((item: any) => {
							if (Number.isInteger(parseInt(item)) && Number.isInteger(result[item])) {
								if (parseInt(item) >= 0) {
									total = total + result[item];
								}
							}
						});

						Object.keys(result).forEach((item: any) => {
							if (Number.isInteger(parseInt(item)) && Number.isInteger(result[item])) {
								if (parseInt(item) >= 0) {
									const calcPercentage = Math.round((result[item] / total) * 100);
									result[item] = [result[item], calcPercentage];
								}
							}
						});
						break;

					case 'registeredPercentage':
						//result = result;
						break;
				}
				updateData({ answer_count: result, options, optionsIndex });
			}
		});
	},
	listenAnswersQuestion: async (
		surveyId: string,
		questionId: string,
		eventId: string,
		setGraphicsData: React.Dispatch<React.SetStateAction<GraphicsData>>,
		operation: string
	) => {
		firestore
			.collection('surveys')
			.doc(surveyId)
			.collection('answers')
			.doc(questionId)
			.collection('responses')
			.orderBy('created','asc')
			.onSnapshot(
				snapshot => {
					const answers = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }) as VoteResponse);
          const { dataValues, labels } = getAssemblyGraphicsData(answers)
					const labelsToShow = labels.map(label => label.complete)
          setGraphicsData({
            dataValues,
            labels,
						labelsToShow
          })
				},
				onError => {
          console.log(onError)
        }
			);
	},
};

export default surveyAnswers;
