import { IMillonaireApi, IStageApi, IQuestionApi } from './../interfaces/MillonaireApi';
const getMillonaireAdapter = (data: IMillonaireApi) => {
  const stages = data?.stages?.map((stageItem: IStageApi) => ({
    stage: stageItem?.number || 0,
    question: {
      question: stageItem?.question?.question || '',
      timeForQuestion: stageItem?.question?.time_limit || 30,
      type: stageItem?.question?.type || '',
      answers:
        stageItem?.question?.answers?.map((answerItem) => ({
          answer: answerItem?.answer || '',
          isCorrect: answerItem?.is_correct || false,
          isTrueOrFalse: answerItem?.is_true_or_false || true,
          type: answerItem?.type || 'text',
        })) || [],
    },
  }));
  const questions = data?.questions?.map((questionItem: IQuestionApi) => ({
    question: questionItem.question || '',
    timeForQuestion: questionItem.time_limit || 30,
    type: questionItem.type || '',
    answers:
      questionItem?.answers?.map((answerItem) => ({
        answer: answerItem?.answer || '',
        isCorrect: answerItem?.is_correct || false,
        isTrueOrFalse: answerItem?.is_true_or_false || true,
        type: answerItem?.type || 'text',
      })) || [],
  }));

  return {
    name: data.name,
    numberOfQuestions: data.number_of_questions,
    rules: data.rules || '',
    timeForQuestions: data.timeForQuestions || 30,
    id: data._id,
    appearance: data.appearance,
    stages: stages,
    questions: questions,
  };
};

export default getMillonaireAdapter;
