import { getAnswersByQuestion } from '@/components/trivia/services';

import {
  Survey,
  Question,
  QuizStats,
  Response,
} from './types';

export default async function useQuizStats(survey: Survey, question: Question, userId: string) {
  const answers: Response[] = await getAnswersByQuestion(survey._id, question.id);
  console.debug('answers', answers);
  if (!answers) {
    console.warn(
      'Cannot get answers by question.',
      'survey title:', survey,
      'survey._id:', survey._id,
      'question.id:', question.id,
    );
    return {
      totalAmount: (survey.questions || []).length,
      passedAmount: 0,
      winnedPoints: 0,
    } as QuizStats;
  }

  let passedAmount = 0;
  let winnedPoints = 0;

  answers
    .filter((answer) => answer.id_user == userId)
    .filter((answer) => answer.correctAnswer)
    .forEach((response) => {
      passedAmount = passedAmount + 1;
      winnedPoints = winnedPoints + question.points;
    });
  
  const result: QuizStats = {
    totalAmount: survey.questions.length,
    passedAmount,
    winnedPoints,
  };
  return result;
}
