export interface IAnswerApi {
  answer: string;
  is_correct: boolean;
  is_true_or_false: boolean;
  type: string;
  id: string;
}

export interface IQuestionApi {
  map(arg0: (questionItem: any) => {}): unknown;
  question: string;
  time_limit: number;
  type: string;
  answers: IAnswerApi[];
  id: string;
}

export interface IStageApi {
  map(arg0: (stage: IStageApi) => void): unknown;
  number: number;
  life_save: boolean;
  score: number;
  id: string;
  question: string;
}
export interface IMillonaireApi {
  _id: string;
  name: string;
  number_of_questions: number;
  timeForQuestions?: number;
  rules?: string;
  event_id: string;
  updated_at: string;
  created_at: string;
  appearance: {
    logo: string;
    background_image: string;
    background_color: string;
  };
  stages: IStageApi[] | any[];
  questions: IQuestionApi[] | any[];
}
