import { AntSelect, AntInput } from "./antField";

const selectOptions = [
  {
    value: "radiogroup",
    text: "Selección Unica"
  },
  {
    value: "checkbox",
    text: "Selección Multiple"
  },
  {
    value: "comment",
    text: "Comentarios"
  },
  {
    value: "text",
    text: "Texto"
  }
];

const filterBy = (data, field, exclude) =>
  exclude ? data.filter(({ value }) => !field.includes(value)) : data.filter(({ value }) => field.includes(value));

export const fieldsFormQuestion = [
  {
    label: "Nombre",
    component: AntInput,
    type: "text",
    name: "name"
  },
  {
    label: "Titulo",
    component: AntInput,
    type: "text",
    name: "title"
  },
  {
    label: "Pagina",
    component: AntInput,
    type: "number",
    name: "page"
  },
  {
    label: "Tipo de Pregunta",
    component: AntSelect,
    selectOptions: filterBy(selectOptions, ["checkbox", "radiogroup"]),
    name: "type"
  },
  {
    label: "Cantidad de Opciones",
    component: AntSelect,
    selectOptions: [2, 3, 4, 5],
    name: "questionOptions"
  }
];

export const initValues = () => {
  let valuesFields = {};
  fieldsFormQuestion.forEach(({ name }) => {
    valuesFields[name] = "";
  });
  return valuesFields;
};
