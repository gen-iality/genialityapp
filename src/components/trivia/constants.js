const selectOptions = [
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

const filterBy = (data, field) =>
  data.filter(({ value }) => field.includes(value));

export default filterBy(selectOptions, ["checkbox", "radiogroup"]);
