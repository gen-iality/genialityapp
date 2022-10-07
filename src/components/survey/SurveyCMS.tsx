import TriviaEdit from '../trivia/edit';

export interface ISurveyCMSProps {
  title: string,
  event: any,
  activityId: string,
  matchUrl: string,
  // Inserted mode
  inserted?: boolean,
  savedSurveyId?: string,
  onSave?: (surveyId: string) => void,
  onDelete?: () => void,
}

export default function SurveyCMS (props: ISurveyCMSProps) {
  return (
    <TriviaEdit {...props} />    
  );
}
