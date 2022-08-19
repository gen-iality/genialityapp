import { SurveysApi } from "@/helpers/request";
import { QuizStatus, QuizStatusRequestData, Survey } from "./types";
import useRequestQuizStatus from "./useRequestQuizStatus";

/**
 * Get the survey answer stats.
 * @param eventId The event ID.
 * @param surveyId The survey ID.
 * @param userId The user ID.
 * @returns ({total: number, right: number, minimum: number})
 */
export default async function useQuizStatusRequesting(eventId: string, surveyId: string, userId: string) {
  console.debug(
    'finding quiz status for userId', userId,
    'with surveyId', surveyId,
  );
  const { getMethod } = useRequestQuizStatus(userId, surveyId);
  
  let quizStatus: QuizStatus = {
    right: 0,
    surveyCompleted: '',
    total: 0,
  };

  const result = await getMethod();
  if (result.exists) {
    const data = result.data() as QuizStatus;
    quizStatus = { ...quizStatus, ...data };
  }
  console.debug(result);

  let minimumScore = 0;
  let questionLength = 0;

  try {
    console.debug('finding eventId', eventId, 'with activityId', surveyId);
    const survey: Survey = await SurveysApi.getOne(eventId, surveyId);
    console.debug(survey);

    minimumScore = survey.minimumScore;
    questionLength = survey.questions.length;
  } catch (err) {
    console.error('SurveysApi.getOne', err);
  }

  const stats: QuizStatusRequestData = {
    total: questionLength,
    right: quizStatus.right,
    minimum: minimumScore,
  };

  return stats;
}
