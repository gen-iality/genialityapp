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

export const VALUES_TOTAL_QUESTIONS = [15, 20, 25, 30];

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
  stage: NaN,
  question: '',
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
  id: '',
};
export const STAGES_VALUES = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];

export const INITIAL_STATE_MODAL_VISIBLE = {
  isVisibleAdd: false,
  isVisibleList: false,
};

export const INITIAL_STATE_VISIBILITY = {
  published: false,
  active: false,
};

export const INITIAL_STATE_USED_WILDCARD = {
  used50: false,
  usedCall: false,
  usedAudience: false,
};

export const INITIAL_STATE_PARTICIPANT = {
  name: '',
  email: '',
  score: 0,
  time: 0,  
  uid: '',
  stages : [],
};

export const INITIAL_ANSWER_TO_RENDER = [
  {
    answer: '',
    isCorrect: false,
    isTrueOrFalse: false,
    type: 'text',
  },
  {
    answer: '',
    isCorrect: false,
    isTrueOrFalse: false,
    type: 'text',
  },
  {
    answer: '',
    isCorrect: false,
    isTrueOrFalse: false,
    type: 'text',
  },
  {
    answer: '',
    isCorrect: false,
    isTrueOrFalse: false,
    type: 'text',
  },
];
export const KEYSDATAIMPORT = [
  'Pregunta',
  'Question',
  'Tiempo por pregunta',
  'Time per question',
  'Respuesta A',
  'Respuesta B',
  'Respuesta C',
  'Respuesta D',
  'Respuesta correcta',
  'Answer A',
  'Answer B',
  'Answer C',
  'Answer D',
  'Correct answer',
];

export const TEMPLATE_DATA = [
  {
    Pregunta: '¿Cuál es el nombre de la mascota de la marca de galletas Oreo?',
    'Tiempo por pregunta': 30,
    'Respuesta A': 'Oreo',
    'Respuesta B': 'Manuel',
    'Respuesta C': 'Coco',
    'Respuesta D': 'Omega',
    'Respuesta correcta': 'A',
  },
  {
    Pregunta: 'Cuantos años tiene el personaje de la serie de dibujos animados Bob Esponja?',
    'Tiempo por pregunta': 30,
    'Respuesta A': '15',
    'Respuesta B': '16',
    'Respuesta C': '17',
    'Respuesta D': '18',
    'Respuesta correcta': 'C',
  },
  {
    Pregunta: 'Cuanto es 2 + 2?',
    'Tiempo por pregunta': 30,
    'Respuesta A': '4',
    'Respuesta B': '5',
    'Respuesta C': '6',
    'Respuesta D': '7',
    'Respuesta correcta': 'A',
  },
  {
    Pregunta: 'Cual es la capital de España?',
    'Tiempo por pregunta': 90,
    'Respuesta A': 'Madrid',
    'Respuesta B': 'Barcelona',
    'Respuesta C': 'Valencia',
    'Respuesta D': 'Sevilla',
    'Respuesta correcta': 'A',
  },
  {
    Pregunta: 'Cual es la capital de Francia?',
    'Tiempo por pregunta': 90,
    'Respuesta A': 'Madrid',
    'Respuesta B': 'Barcelona',
    'Respuesta C': 'Valencia',
    'Respuesta D': 'París',
    'Respuesta correcta': 'D',
  },
  {
    Pregunta: 'Cual es la capital de Italia?',
    'Tiempo por pregunta': 90,
    'Respuesta A': 'Madrid',
    'Respuesta B': 'Barcelona',
    'Respuesta C': 'Roma',
    'Respuesta D': 'Sevilla',
    'Respuesta correcta': 'C',
  },
  {
    Pregunta: 'Cual es la capital de Alemania?',
    'Tiempo por pregunta': 90,
    'Respuesta A': 'Berlín',
    'Respuesta B': 'Barcelona',
    'Respuesta C': 'Valencia',
    'Respuesta D': 'Sevilla',
    'Respuesta correcta': '1',
  },
  {
    Pregunta: 'Cual es la capital de Portugal?',
    'Tiempo por pregunta': 90,
    'Respuesta A': 'Madrid',
    'Respuesta B': 'Lisboa',
    'Respuesta C': 'Valencia',
    'Respuesta D': 'Sevilla',
    'Respuesta correcta': 'B',
  },
  {
    Pregunta: 'Cual es la capital de Grecia?',
    'Tiempo por pregunta': 90,
    'Respuesta A': 'Madrid',
    'Respuesta B': 'Barcelona',
    'Respuesta C': 'Atenas',
    'Respuesta D': 'Sevilla',
    'Respuesta correcta': 'C',
  },
  {
    Pregunta: 'Cual es la capital de Rusia?',
    'Tiempo por pregunta': 90,
    'Respuesta A': 'Madrid',
    'Respuesta B': 'Barcelona',
    'Respuesta C': 'Valencia',
    'Respuesta D': 'Moscú',
    'Respuesta correcta': 'D',
  },
];
