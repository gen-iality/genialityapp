export interface IMillonaire {
  name: string;
  numberOfQuestions: number;
  timeForQuestions: number;
  rules?: string;
}
export interface IQuestions {
  question: string;
  lifeSaver: boolean;
  score: number;
  timeForQuestion: number;
  type: 'text' | 'image';
  answers: IAnswers;
}
export interface IAnswers {
  answer: string;
  isCorrect: boolean;
  isTrueOrFalse: number;
  type: 'text' | 'image';
}
export interface IUserScore {
  answer: string;
  isCorrect: boolean;
  isTrueOrFalse: number;
  type: 'text' | 'image';
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
  millonaire: IMillonaire | null;
  loading: boolean;
  isNewGame: boolean;
  onChangeMillonaire: (name: string, value: any) => void;
  onCreateMillonaire: () => void;
  onSubmit: () => void;
};
