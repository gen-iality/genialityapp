import { background_image, background_color } from './../../bingo/constants/constants';
export interface IMillonaire {
  questions: IQuestions[] | any[];
  name: string;
  numberOfQuestions: number | null;
  timeForQuestions?: number;
  rules?: string;
  appearance: {
    logo: string;
    background_image: string;
    background_color: string;
  };
  id?: string;
  stages: IStages[] | any[];
}
export interface IStages {
  stage: number;
  question: IQuestions[] | any[];
  lifeSaver: boolean;
  score: number;
}

export interface IQuestions {
  question: string;
  timeForQuestion: number;
  type: string;
  answers: IAnswers[] | any[];
}
export interface IAnswers {
  answer: string;
  isCorrect: boolean;
  isTrueOrFalse: number;
  type: string;
}
export interface IUserScore {
  answer: string;
  isCorrect: boolean;
  isTrueOrFalse: boolean;
  type: string;
}
export interface IUserAnswer {
  timePerQuestion: number;
  useLifesaver: boolean;
  score: number;
  answer: string;
  questions: string;
  isCorrect: boolean;
}
export interface IUserRating {
  name: string;
  score: number;
  time: number;
  email: string;
}
export type TMillonaireContextProps = {
  event: any;
  millonaire: IMillonaire;
  loading: boolean;
  isNewGame: boolean;
  question: IQuestions;
  stage: IStages;
  isVisibleModalQuestion: boolean;
  isVisibleModalStage: boolean;
  onChangeMillonaire: (name: string, value: any) => void;
  onChangeAppearance: (name: string, value: any) => void;
  onCreateMillonaire: () => void;
  onSubmit: () => void;
  onDelete: () => Promise<void>;
  onSaveQuestion: () => void;
  onSaveStage: () => void;
  onCancelModalQuestion: () => void;
  onCancelModalStage: () => void;
  setIsVisibleModalQuestion: any;
  setIsVisibleModalStage: any;
};

export interface IEditModal {
  isEdit: boolean;
  id: null;
}
