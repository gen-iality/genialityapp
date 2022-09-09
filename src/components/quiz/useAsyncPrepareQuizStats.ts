import { SurveysApi } from "@/helpers/request";
import { QuizStatus, QuizStats, Survey } from "./types";
import useRequestQuizStatus from "./useRequestQuizStatus";

/**
 * Get the survey answer stats.
 * @param eventId The event ID.
 * @param surveyId The survey ID.
 * @param userId The user ID.
 * @param [survey] Optional survey object
 * @returns ({total: number, right: number, minimum: number})
 */
export default async function useQuizStatusRequesting(eventId: string, surveyId: string, userId: string, survey?: Survey) {
  console.debug(
    'finding quiz status for userId', userId,
    'with surveyId', surveyId,
  );
  const { getMethod } = useRequestQuizStatus(userId, surveyId);
  
  let quizStatus: QuizStatus = {
    right: 0,
    surveyCompleted: '',
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

    let surveyIn: Survey = survey ? survey : await SurveysApi.getOne(eventId, surveyId);
    console.debug(surveyIn);

    minimumScore = surveyIn.minimumScore;
    questionLength = surveyIn.questions.length;
  } catch (err) {
    console.error('SurveysApi.getOne', err);
  }

  const stats: QuizStats = {
    total: questionLength,
    right: quizStatus.right,
    minimum: minimumScore,
  };

  return stats;
}