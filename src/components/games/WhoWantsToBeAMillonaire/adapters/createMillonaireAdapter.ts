import { IMillonaire } from './../interfaces/Millonaire';
const createMillonaireAdapter = (body: IMillonaire) => {
  // craete stages with number of questions

  return {
    name: body.name,
    number_of_stages: body.numberOfQuestions,
    timeForQuestions: body.timeForQuestions || 30,
    rules: body.rules || '',
    appearance: body.appearance,
    // stages: body.stages,
  };
};
export default createMillonaireAdapter;
