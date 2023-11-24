import { Score } from '@/components/games/common/Ranking/types';

export interface IMillonaire {
  questions: IQuestions[] | any[];
  name: string;
  numberOfQuestions: number | null;
  timeForQuestions?: number;
  rules?: string;
  appearance: {
    logo: string;
    // background_image: string;
    background_color: string;
    primary_color:string;
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
  isVisibleModalAnswer: boolean;
  isVisibleModalAnswerList: boolean;
  previusStage: IStages;
  laterStage: IStages;
  published: boolean;
  active: boolean;
  scores: Score[];
  tab: string;
  answers: IAnswers[];
  isVisibleModalImport: boolean;
  enableSaveButton: boolean;
  preserveInformation: boolean;
  participants: IParticipant[];
  setImportData: (data: any) => void;
  setPreserveInformation: (data: boolean) => void;
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
  onActionEditQuestion: (question: IQuestions, index: string | number) => void;
  onActionEditAnwser: (answer: IAnswers, index: string | number) => void;
  onSubmitQuestion: () => void;
  onSubmitAnswer: () => void;
  onSubmitStage: () => void;
  onDeleteAnswer: (answer: IAnswers, index: number) => void;
  onChangeVisibleModalAnswer: () => void;
  onChangeVisibleModalAnswerList: () => void;
  onActiveModalStage: () => void;
  onActionEditStage: (stage: IStages, index: string | number) => void;
  onChangeVisibilityControl: (name: string, value: boolean) => void;
  onResetProgressAll: () => void;
  onChangeTab: (key: string) => void;
  onChangeAnswerFour: (key: number, name: string, value: string | boolean) => void;
  onSaveAnswerFour: () => void;
  onActiveModalImport: () => void;
  onHandleXlsx: (data: IDataImport[]) => void;
  onSaveDataImport: () => void;
  setEnableSaveButton: (data: boolean) => void;
};

export interface TMillonaireContextPropLanding {
  event: any;
  millonaire: IMillonaire;
  stages: IStages[];
  loading: boolean;
  isVisible: boolean;
  startGame: boolean;
  currentStage: IStages;
  time: number;
  score: number;
  statusGame: string;
  question: IQuestions;
  stage: number;
  visibilityControl: IVisibility;
  scoreUser: Score;
  scores: Score[];
  usedWildCards: {
    used50: boolean;
    usedCall: boolean;
    usedAudience: boolean;
  };
  prevStage: IStages;
  prevScore: number;
  onChangeVisibilityDrawer: () => void;
  onStartGame: () => void;
  onFinishedGame: (prevScore: string) => void;
  onFiftyOverFifty: () => void;
  onSaveAnswer: (question: IQuestions, answer: IAnswers) => void;
  onAnnouncement: () => void;
  onChangeStatusGame: (status: string) => void;
}

export interface IEditModal {
  isEdit: boolean;
  id: string | number;
}

export interface IModalVisible {
  isVisibleAdd: boolean;
  isVisibleList: boolean;
}

export interface IRenderViewLanding {
  NOT_STARTED: JSX.Element;
  STARTED: JSX.Element;
  GAME_OVER: JSX.Element;
  ANNOUNCEMENT: JSX.Element;
}
export interface IVisibility {
  published: boolean;
  active: boolean;
  //restablecer progreso
  resetProgress: boolean;
}

export interface TimerM {
  countdown: number;
  timer: number;
}

export interface IDataImport {
  Pregunta: string;
  'Tiempo por pregunta': number;
  'Respues A': string;
  'Respues B': string;
  'Respues C': string;
  'Respues D': string;
  'Respuesta correcta': string | number;
}
export interface ButtonMillonaire {
  isTitle?: boolean;
}

export interface IParticipant {
  name: string;
  email: string;
  score: number;
  time: number;
  uid: string;
  stages: IParticipantStage[];
}

export interface IParticipantStage {
  stage: number;
  score: number;
  time: number;
  question: string;
  answer: string;
}
