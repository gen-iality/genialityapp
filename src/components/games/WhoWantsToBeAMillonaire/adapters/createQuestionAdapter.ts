import { IQuestions, IAnswers } from './../interfaces/Millonaire';
const createQuestionAdapter = (body: IQuestions) => {
  const answers =
    body.answers.map((answerToAdapter: IAnswers) => ({
      answer: answerToAdapter.answer,
      is_correct: answerToAdapter.isCorrect || false,
      is_true_or_false: answerToAdapter.isTrueOrFalse || false,
      type: answerToAdapter.type,
    })) || [];

  return {
    question: body.question,
    time_limit: body.timeForQuestion,
    type: body.type || 'text',
    answers: answers,
  };
};
export default createQuestionAdapter;
