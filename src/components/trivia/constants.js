// Lista de los tipos de pregunta posibles para la encuesta
export const selectOptions = [
  {
    value: "radiogroup",
    text: "Selección Unica",
  },
  {
    value: "checkbox",
    text: "Selección Multiple",
  },
  {
    value: "comment",
    text: "Comentarios",
  },
  {
    value: "text",
    text: "Texto",
  },
];

// Funcion que filtra los tipos de pregunta para la encuesta
const filterBy = (data, field, exclude) =>
  exclude ? data.filter(({ value }) => !field.includes(value)) : data.filter(({ value }) => field.includes(value));

// Lista de los campos para la creacion de una pregunta
export const fieldsFormQuestion = [
  {
    label: "Pregunta",
    type: "text",
    name: "title",
  },
  {
    label: "Tipo de Pregunta",
    selectOptions: filterBy(selectOptions, ["checkbox", "radiogroup", "text"]),
    name: "type",
  },
];

// Funcion que retorna los valores iniciales para los campos de la creacion de la pregunta
export const initValues = () => {
  let valuesFields = {};
  fieldsFormQuestion.forEach(({ name }) => {
    valuesFields[name] = "";
  });
  return valuesFields;
};
