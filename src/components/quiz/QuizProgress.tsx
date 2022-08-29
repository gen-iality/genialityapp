import * as React from 'react';
import { useState, useEffect, useMemo } from 'react';

import {
  Typography,
  Space,
} from 'antd';

import {
  QuizStats,
} from './types';
import QuizBadge from './QuizBadge';
import useAsyncPrepareQuizStats from './useAsyncPrepareQuizStats';
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
  const [requiredMinimum, setRequiredMinimum] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    useAsyncPrepareQuizStats(props.eventId, props.surveyId, props.userId)
      .then((stats: QuizStats) => {
        // Update stats
        setTotalAnswers(stats.total);
        setGoodAnswers(stats.right);
        setRequiredMinimum(stats.minimum);
        setIsLoading(false);
      })
      .catch((err: any) => {
        console.error('Cannot request with SurveysApi or Firestore:', err);
      });
  }, [props.eventId, props.surveyId, props.userId, isLoading]);

  return (
    <QuizBadge right={goodAnswers} total={totalAnswers} minimum={requiredMinimum} isLoading={isLoading}/>
  );
};

export default QuizProgress;
