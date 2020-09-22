// a little function to help us with reordering the result
export const Reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

const grid = 6;
export const getItemStyle = (isDragging, draggableStyle) => {
  return {
    // some basic styles to make the items look a bit nicer
    userSelect: "none",
    padding: grid * 2,
    margin: `0 0 ${grid}px 0`,
    textAlign: "left",

    // change background colour if dragging
    background: isDragging ? "lightgreen" : "#1BD5DF",

    // styles we need to apply on draggables
    ...draggableStyle,
  };
};

export const getQuestionListStyle = (isDraggingOver) => ({
  background: isDraggingOver ? "#CA4FC4" : "",
  padding: 8,
  width: 350,
});
