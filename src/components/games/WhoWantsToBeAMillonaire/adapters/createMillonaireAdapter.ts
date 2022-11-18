import { IMillonaire } from './../interfaces/Millonaire';
const createMillonaireAdapter = (body: IMillonaire) => {
  return {
    name: body.name,
    number_of_questions: body.numberOfQuestions,
    timeForQuestions: body.timeForQuestions || 30,
    rules: body.rules || '',
    appearance: body.appearance,
  };
};
export default createMillonaireAdapter;
