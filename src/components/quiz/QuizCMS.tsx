import * as React from 'react';
import TriviaEdit from '../trivia/edit';

export interface QuizCMSProps {
  event: any,
  activityId: string,
  matchUrl: string,
  // Inserted mode
  inserted?: boolean,
  savedSurveyId?: string,
  onSave?: (surveyId: string) => void,
  onDelete?: () => void,
};

function QuizCMS(props: QuizCMSProps) {
  return (
    <TriviaEdit {...props} />
  );
}

export default QuizCMS;
