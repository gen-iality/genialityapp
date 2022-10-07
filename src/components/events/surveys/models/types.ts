type FoolBoolean = boolean | 'true' | 'false';

interface SurveyQuestion {
  title: string;
  type: 'radiogroup' | 'checkbox' | 'ranking' | 'ranking' | 'matrix' | 'comment' | 'text' | string;
  choices: string[];
  id: string;
  image: string | null;
  points: number;
  correctAnswer: string;
  correctAnswerIndex: number;
};

export interface SurveyData {
  _id?: string,
  survey: string,
  show_horizontal_bar: boolean,
  graphyType: string,
  allow_vote_value_per_user: FoolBoolean,
  event_id: string,
  activity_id: string,
  points: number,
  initialMessage: string,
  time_limit: number,
  win_Message: string,
  neutral_Message: string,
  lose_Message: string,
  allow_anonymous_answers: FoolBoolean,
  allow_gradable_survey: FoolBoolean,
  hasMinimumScore: FoolBoolean,
  isGlobal: FoolBoolean,
  showNoVotos: FoolBoolean,
  freezeGame: boolean,
  open: FoolBoolean,
  publish: FoolBoolean,
  minimumScore: number,
  updated_at: string,
  created_at: string,
  questions: SurveyQuestion[],
  displayGraphsInSurveys: FoolBoolean,
  rankingVisible: FoolBoolean,
  random_survey_count: number,
  random_survey: boolean,
}

export interface SurveyRealtimeData {
  activity_id: string,
  allow_anonymous_answers: FoolBoolean,
  allow_gradable_survey: FoolBoolean,
  category: any,
  displayGraphsInSurveys: FoolBoolean,
  eventId: string,
  freezeGame: boolean,
  hasMinimumScore: FoolBoolean,
  isGlobal: FoolBoolean,
  isOpened: FoolBoolean,
  isPublished: FoolBoolean,
  minimumScore: number,
  name: string,
  random_survey: boolean,
  random_survey_count: number,
  rankingVisible: FoolBoolean,
  showNoVotos: FoolBoolean,
  time_limit: number,
  tries: number,
};

export interface SurveyPreModel extends SurveyRealtimeData, SurveyData {
  currentPage: number,
};
