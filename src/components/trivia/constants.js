// Lista de los tipos de pregunta posibles para la encuesta
export const selectOptions = [
  {
    value: 'radiogroup',
    text: 'Selección Única',
  },
  {
    value: 'checkbox',
    text: 'Selección Múltiple',
  },
  {
    value: 'comment',
    text: 'Comentarios',
  },
  {
    value: 'text',
    text: 'Texto',
  },
];

// Lista de los tiempos predeterminados para el select de la encuesta
export const surveyTimeOptions = [
  {
    value: 0,
    text: 'Sin limite',
  },
  {
    value: 30,
    text: '30 segundos',
  },
  {
    value: 60,
    text: '60 segundos',
  },
  {
    value: 300,
    text: '5 minutos',
  },
  {
    value: 600,
    text: '10 minutos',
  },
];

// Funcion que filtra los tipos de pregunta para la encuesta
const filterBy = (data, field, exclude) =>
  exclude ? data.filter(({ value }) => !field.includes(value)) : data.filter(({ value }) => field.includes(value));

// Lista de los campos para la creacion de una pregunta
export const fieldsFormQuestion = [
  {
    label: 'Pregunta',
    type: 'text',
    name: 'title',
  },

  {
    label: 'Tipo de Pregunta',
    selectOptions: filterBy(selectOptions, ['checkbox', 'radiogroup', 'text']),
    name: 'type',
  },
];

export const fieldsFormQuestionWithPoints = [
  {
    label: 'Pregunta',
    type: 'text',
    name: 'title',
  },

  {
    label: 'Tipo de Pregunta',
    selectOptions: filterBy(selectOptions, ['checkbox', 'radiogroup', 'text']),
    name: 'type',
  },
  {
    label: 'Puntos de pregunta',
    type: 'number',
    name: 'points',
  },
];

// Funcion que retorna los valores iniciales para los campos de la creacion de la pregunta
export const initValues = () => {
  let valuesFields = {};
  fieldsFormQuestion.forEach(({ name }) => {
    valuesFields[name] = '';
  });
  return valuesFields;
};

export const searchWithMultipleIndex = (arr, arrIndex) => {
  let response = [];
  for (let index = 0; index < arrIndex.length; index++) {
    response.push(arr[arrIndex[index]]);
  }
  return response;
};

export const operationType = [
  {
    value: 'onlyCount',
    text: 'Mostrar cuenta',
  },
  {
    value: 'participationPercentage',
    text: 'Mostrar porcentaje de participacion',
  },
];
