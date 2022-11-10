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
  question: string;
  lifeSaver: boolean;
  score: number;
  id?: string;
}

export interface IQuestions {
  question: string;
  timeForQuestion: number;
  type: string;
  answers: IAnswers[] | any[];
  id?: string;
}
export interface IAnswers {
  answer: string;
  isCorrect: boolean;
  isTrueOrFalse: boolean;
  type: string;
  id?: string;
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
  answer: IAnswers;
  stage: IStages;
  isVisibleModalQuestion: boolean;
  isVisibleModalStage: boolean;
  isEditAnswer: boolean;
  isEditQuestion: boolean;
  isEditStage: boolean;
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
  onChangeQuestion: (name: string, value: string) => void;
  onChangeAnswer: (name: string, value: string | boolean) => void;
  onChangeStage: (name: string, value: string | boolean | number) => void;
  onSaveAnswerInQuestion: () => void;
  onDeleteQuestion: (question: IQuestions) => void;
  onDeleteStage: (stage: IStages) => void;
  onActionEditQuestion: (question: IQuestions) => void;
  onActionEditAnwser: (answer: IAnswers) => void;
  onSubmitQuestion: () => void;
  onSubmitAnswer: () => void;
  onSubmitStage: () => void;
};

export interface TMillonaireContextPropLanding {
  event: any;
  millonaire: IMillonaire;
  stages: IStages;
  loading: boolean;
  isVisible: boolean;
  startGame: boolean;
  currentStage: IStages | string;
  onChangeVisibilityDrawer: () => void;
  onStartGame: () => void;
  onFinishedGame: () => void;
  onFiftyOverFifty: () => void;
  onSaveAnswer: (question: IQuestions, answer: IAnswers) => void;
}

export interface IEditModal {
  isEdit: boolean;
  id: null;
}
