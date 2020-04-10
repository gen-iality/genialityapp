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

const filterBy = (data, field, exclude) =>
  exclude
    ? data.filter(({ value }) => !field.includes(value))
    : data.filter(({ value }) => field.includes(value));

export default filterBy(selectOptions, ["checkbox", "radiogroup"]);
