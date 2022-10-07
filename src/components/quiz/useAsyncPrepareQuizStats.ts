import { SurveysApi } from '@/helpers/request';
import { QuizStatus, QuizStats, Survey } from './types';
import { getStatus as getSurveyStatus } from '../events/surveys/services/surveyStatus';

/**
 * Get the survey answer stats.
 * @param eventId The event ID.
 * @param surveyId The survey ID.
 * @param userId The user ID.
 * @param [survey] Optional survey object
 * @returns ({total: number, right: number, minimum: number})
 */
export default async function useQuizStatusRequesting(
  eventId: string,
  surveyId: string,
  userId: string,
  survey?: Survey
) {
  console.debug('finding quiz status for userId', userId, 'with surveyId', surveyId);

  let quizStatus: QuizStatus = {
    right: 0,
    surveyCompleted: '',
  };
  let minimumScore = 0;
  let totalPoints = 0;

  if (!surveyId) return { total: totalPoints, right: quizStatus.right, minimum: minimumScore } as QuizStats;

  // Get info from Firebase: status that contains the `right` and `surveyCompleted` values
  try {
    const result = await getSurveyStatus(surveyId, userId);
    if (result?.exists) {
      const data = result.data() as QuizStatus;
      quizStatus = { ...quizStatus, ...data };
    }
  } catch (err) {
    console.error(err);
  }

  // Get info about the survey from the API to get the minimum value
  try {
    console.debug('finding eventId', eventId, 'with activityId', surveyId);

    const surveyIn: Survey = survey ? survey : await SurveysApi.getOne(eventId, surveyId);

    minimumScore = surveyIn.minimumScore ? surveyIn.minimumScore : 0;
    // questionLength = surveyIn.questions ? surveyIn.questions.length : 0;
    totalPoints = (surveyIn.questions || []) // For each question
      .map((question: any) => parseInt(question.points || 0)) // Get their points
      .reduce((a, b) => a+b, 0); // And sum
  } catch (err) {
    console.error('SurveysApi.getOne', err);
  }

  const stats: QuizStats = {
    // total: questionLength,
    total: totalPoints,
    right: quizStatus.right,
    minimum: minimumScore,
  };

  return stats;
}
