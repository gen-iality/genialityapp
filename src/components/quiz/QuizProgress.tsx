import * as React from 'react';
import { Dayjs } from 'dayjs';
import { useState, useEffect, useMemo } from 'react'

import {
  Typography,
  Badge,
  Space,
} from 'antd';

import { SurveysApi } from '@/helpers/request';

import useQuizQuestionStats from './useQuizQuestionStats';
import QuizStatusMessage from './quizStatus';
import {
  Response,
  Survey,
} from './types';
import QuizBadge from './QuizBadge';

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

  useEffect(() => {
    (async () => {
      console.debug('finding eventId', props.eventId, 'with activityId', props.surveyId);
      const survey: Survey = await SurveysApi.getOne(props.eventId, props.surveyId);

      let totalResponses = survey.questions.length;
      let goodResponses = 0;
      let winnedPoints = 0;

      // Find in each question all answers.
      // NOTE: not try to optimize using .forEach or .map at least that you know to use Promise.all
      console.debug('The survey\'s questions are:');
      for (let i = 0; i < survey.questions.length; i++) {
        const question = survey.questions[i];
        const stats = await useQuizQuestionStats(survey, question, props.userId);
        goodResponses = goodResponses + stats.passedAmount
        winnedPoints = winnedPoints + stats.winnedPoints;
      }

      // Update stats
      setTotalAnswers(totalResponses);
      setGoodAnswers(goodResponses);
      setIsPassedQuiz(winnedPoints >= survey.minimumScore);
    })().catch((err) => console.error('Cannot request with SurveysApi or Firestore:', err));
  }, []);

  /**
   * The stats message that says how many answers were responsed rightly
   */
   const statsMessage = useMemo(() => {
    if (isPassedQuiz === undefined) return 'N de M';
    return `${goodAnswers} de ${totalAnswers}`;
  }, [isPassedQuiz, totalAnswers, goodAnswers]);

  return (
    <Space>
      <QuizBadge isPassedQuiz={isPassedQuiz} passedMessage={passedMessage} />
      {' '}
      <Typography.Text strong>{statsMessage}</Typography.Text>
    </Space>
  );
};

export default QuizProgress;
