import * as React from 'react';
import { Dayjs } from 'dayjs';
import { useState, useEffect, useMemo } from 'react';

import {
  Typography,
  Badge,
  Space,
} from 'antd';

import { SurveysApi } from '@/helpers/request';
import { getAnswersByQuestion } from '@/components/trivia/services';

type Question = {
  title: string;
  type: "radiogroup" | string;
  choices: string[];
  id: string;
  image: string | null;
  points: number;
  correctAnswer: string;
  correctAnswerIndex: number;
};

type Survey = {
  _id?: string;
  survey: string;
  show_horizontal_bar: boolean;
  graphyType: string;
  allow_vote_value_per_user: 'false' | 'true'; // That's awful
  event_id: string;
  activity_id: string;
  points: number;
  initialMessage: string;
  time_limit: number;
  win_Message: string | null;
  neutral_Message: string | null;
  lose_Message: string | null;
  allow_anonymous_answers: boolean;
  allow_gradable_survey: boolean;
  hasMinimumScore: 'false' | 'true'; // That's awful
  isGlobal: boolean;
  showNoVotos: 'false' | 'true'; // That's awful
  freezeGame: boolean;
  open: 'false' | 'true'; // That's awful
  publish: 'false' | 'true'; // That's awful
  minimumScore: number;
  updated_at: Dayjs;
  created_at: Dayjs;
  questions: Question[];
  displayGraphsInSurveys: 'false' | 'true'; // That's awful
  rankingVisible: "true"};

type Response = {
  correctAnswer: boolean;
  created: Dayjs;
  id_survey: string;
  id_user: string;
  response: string;
  user_email: string;
  user_name: string;
};

interface QuizProgressProps {
  /**
   * The event ID
   */
  eventId: string,
  /**
   * The activity ID
   */
  activityId: string,
  /**
   * The current survey ID
   */
  surveyId: string,
  /**
   * The current user ID
   */
  userId: string,
}

const QuizStatusMessage = {
  PASSED: 'aprobado',
  NOT_PASSED: 'reprobado',
  NO_QUESTIONS: 'sin preguntas',
  PROCESSING: 'procesando...',
};

const QuizProgress: React.FunctionComponent<QuizProgressProps> = (props) => {
  const [totalAnswers, setTotalAnswers] = useState(0);
  const [goodAnswers, setGoodAnswers] = useState(0);
  const [isPassedQuiz, setIsPassedQuiz] = useState<boolean | undefined>(undefined);

  const passedMessage = useMemo(() => {
    if (isPassedQuiz === undefined) return QuizStatusMessage.PROCESSING;
    if (totalAnswers === 0) return QuizStatusMessage.NO_QUESTIONS;
    if (isPassedQuiz) return QuizStatusMessage.PASSED;
    return QuizStatusMessage.NOT_PASSED;
  }, [isPassedQuiz, totalAnswers]);

  /**
   * The badget color, gray while it is processing, red and green pretty to other states
   */
  const badgetColor = useMemo(() => {
    // Check out the 3 status
    if (isPassedQuiz === undefined) return '#7D7D7D';
    return isPassedQuiz ? '#5EB841' : '#B8415A';
  }, [isPassedQuiz]);

  /**
   * The stats message that says how many answers were responsed rightly
   */
  const statsMessage = useMemo(() => {
    if (isPassedQuiz === undefined) return 'N de M';
    return `${goodAnswers} de ${totalAnswers}`;
  }, [isPassedQuiz, totalAnswers, goodAnswers]);

  useEffect(() => {
    (async () => {
      console.debug('finding eventId', props.eventId, 'with activityId', props.surveyId);
      const survey: Survey = await SurveysApi.getOne(props.eventId, props.surveyId);

      const totalResponses = survey.questions.length;
      let goodResponses = 0;
      let winnedPoints = 0;

      // Find in each question all answers.
      // NOTE: not try to optimize using .forEach or .map at least that you know to use Promise.all
      console.debug('The survey\'s questions are:');
      for (let i = 0; i < survey.questions.length; i++) {
        const question = survey.questions[i];
        const answers: Response[] = await getAnswersByQuestion(survey._id, question.id);
        console.debug('answers', answers);

        answers
          .filter((answer) => answer.id_user == props.userId)
          .filter((answer) => answer.correctAnswer)
          .forEach((response) => {
            goodResponses = goodResponses + 1;
            winnedPoints = winnedPoints + question.points;
          });
      }

      // Update stats
      setTotalAnswers(totalResponses);
      setGoodAnswers(goodResponses);
      setIsPassedQuiz(winnedPoints >= survey.minimumScore);
    })().catch((err) => console.error('Cannot request with SurveysApi or Firestore:', err));
  }, []);

  return (
    <Space>
      <Badge count={passedMessage} style={{ backgroundColor: badgetColor }}/>
      {' '}
      <Typography.Text strong>{statsMessage}</Typography.Text>
    </Space>
  );
};

export default QuizProgress;
