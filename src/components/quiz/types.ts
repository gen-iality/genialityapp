import { Dayjs } from 'dayjs';

export type Question = {
  title: string;
  type: "radiogroup" | string;
  choices: string[];
  id: string;
  image: string | null;
  points: number;
  correctAnswer: string;
  correctAnswerIndex: number;
};

export type Survey = {
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
  rankingVisible: 'true' | 'false',
};

export type QuizStatus = {
  surveyCompleted: string,
  right: number,
};

export type QuizStats = {
  total: number,
  right: number,
  minimum: number,
};
