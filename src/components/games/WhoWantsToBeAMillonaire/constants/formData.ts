export const VALUES_TIME_PER_ANSWERS = [
  {
    label: '10 segundos',
    value: 10,
  },
  {
    label: '15 segundos',
    value: 15,
  },
  {
    label: '25 segundos',
    value: 25,
  },
  {
    label: '30 segundos',
    value: 30,
  },
  {
    label: '45 segundos',
    value: 45,
  },
  {
    label: '50 segundos',
    value: 50,
  },
  {
    label: '60 segundos',
    value: 60,
  },
  {
    label: '1 minuto y 30 segundos',
    value: 90,
  },
];
export const INITIAL_VALUES_DATA_CREATE = {
  name: '',
  numberOfQuestions: '',
  timeForQuestions: '',
  rules: '',
};

export const VALUES_TOTAL_QUESTIONS = [15, 30, 45, 60, 75];

export const INITIAL_STATE_ANSWER = {
  answer: '',
  isCorrect: false,
  isTrueOrFalse: false,
  type: 'text',
};
export const INITIAL_STATE_QUESTION = {
  question: '',
  timeForQuestion: 30,
  type: 'text',
  answers: [],
};
export const INITIAL_STATE_STAGE = {
  stage: 0,
  question: [],
  lifeSaver: false,
  score: 100,
};

export const INITIAL_STATE_MILLONAIRE = {
  name: '',
  numberOfQuestions: null,
  timeForQuestions: 30,
  rules: '',
  id: '',
  appearance: {
    logo: '',
    background_image: '',
    background_color: '',
  },
  questions: [],
  stages: [],
};

export const INITIAL_STATE_EDIT_MODAL = {
  isEdit: false,
  id: null,
};
