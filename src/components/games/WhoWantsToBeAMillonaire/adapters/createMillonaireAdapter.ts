import { IMillonaire } from './../interfaces/Millonaire';
const createMillonaireAdapter = (body: IMillonaire) => {
  // craete stages with number of questions
  const stages = [];
  for (let i = 0; i < body.numberOfQuestions!; i++) {
    stages.push({
        number: i + 1,
        question: '',
        life_save: false,
        score: 100 * (i + 1),
    });
  }


  return {
    name: body.name,
    number_of_questions: body.numberOfQuestions,
    timeForQuestions: body.timeForQuestions || 30,
    rules: body.rules || '',
    appearance: body.appearance,
    stages,
  };
};
export default createMillonaireAdapter;
