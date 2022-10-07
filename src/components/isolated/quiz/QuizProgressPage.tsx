import * as React from 'react';
import { Typography } from 'antd';
import QuizProgress from '../../quiz/QuizProgress';
import QuizzesProgress from '@components/quiz/QuizzesProgress';

// const eventId = '6283a7692d274913605fe751';
// const activityId = '';
// const surveyId = 'surveyId-feo'; // '62b5f084feafaf385d5e0db2'; // '6290f04db2f8f12ef71499a2'; // Testing...
// const userId = '62435eb2376a46484848f542'; // '624f3f9c155d673b69463be6'; // This user is testly the current user

const surveyId = '62ffdbd6bcf8b0f263b2a2fa';
const userId = 'userId-feo';
const eventId = 'eventId-feo';

export interface IQuizProgressPageProps {
  matchUrl: string,
  event: any,
}

export function QuizProgressPage (props: IQuizProgressPageProps) {
  return (
    <div>
      <Typography.Title>
        Quiz progress
      </Typography.Title>
      <QuizProgress
        eventId={eventId}
        surveyId={surveyId}
        userId={userId}
      />
      <hr />
      <QuizzesProgress
        eventId={eventId}
        userId={userId}
      />
    </div>
  );
}
