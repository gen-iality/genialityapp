import { IMillonaireApi, IStageApi, IQuestionApi } from './../interfaces/MillonaireApi';
const getMillonaireAdapter = (data: IMillonaireApi) => {
  console.log('🚀 ~ file: getMillonaireAdapter.ts ~ line 3 ~ getMillonaireAdapter ~ data', data);
  const stages = data?.stages?.map((stageItem: IStageApi) => ({
    stage: stageItem?.number || 0,
    question: stageItem.question || '',
    lifeSaver: stageItem.life_save || false,
    score: stageItem.score,
    id: stageItem.id || '',
  }));
  const questions = data?.questions?.map((questionItem: IQuestionApi) => ({
    question: questionItem.question || '',
    timeForQuestion: questionItem.time_limit || 30,
    type: questionItem.type || '',
    id: questionItem?.id,
    answers:
      questionItem?.answers?.map((answerItem) => ({
        id: answerItem?.id,
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
