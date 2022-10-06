type FoolBoolean = boolean | 'true' | 'false';

interface SurveyQuestion { [x: string]: any };

export interface SurveyFromMongoDB {
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
  allow_anonymous_answers: boolean,
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

export interface SurveyFromFirebase {};

export interface SurveyPreModel extends SurveyFromFirebase, SurveyFromMongoDB {
  currentPage: number,
};
