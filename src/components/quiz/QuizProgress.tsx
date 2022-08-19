import * as React from 'react';
import { Dayjs } from 'dayjs';
import { useState, useEffect, useMemo } from 'react';

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
  QuizStatus,
  QuizStatusRequestData,
} from './types';
import QuizBadge from './QuizBadge';
import useRequestQuizStatus from './useRequestQuizStatus';
import useAsyncQuizStatusRequesting from './useAsyncQuizStatusRequesting';
interface QuizProgressProps {
  /**
   * The event ID
   */
  eventId: string,
  /**
   * The current survey ID
   */
  surveyId: string,
  /**
   * The current user ID
   */
  userId: string,
}

function QuizProgress(props: QuizProgressProps) {
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
    useAsyncQuizStatusRequesting(props.eventId, props.surveyId, props.userId)
      .then((stats: QuizStatusRequestData) => {
        // Update stats
        setTotalAnswers(stats.total);
        setGoodAnswers(stats.right);
        setIsPassedQuiz(stats.right >= stats.minimum);
      })
      .catch((err: any) => {
        console.error('Cannot request with SurveysApi or Firestore:', err);
      });
  }, [props.eventId, props.surveyId, props.userId]);

  /**
   * The stats message that says how many answers were responsed rightly
   */
   const statsMessage = useMemo(() => {
    if (isPassedQuiz === undefined) {
      return 'N de M';
    }

    return `${goodAnswers} de ${totalAnswers}`;
  }, [isPassedQuiz, totalAnswers, goodAnswers]);

  return (
    <Space>
      <QuizBadge isRight={isPassedQuiz} message={passedMessage} />
      {' '}
      <Typography.Text strong>{statsMessage}</Typography.Text>
    </Space>
  );
};

export default QuizProgress;
