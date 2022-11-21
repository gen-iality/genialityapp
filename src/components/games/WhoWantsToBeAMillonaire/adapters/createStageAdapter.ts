import { IStages } from '../interfaces/Millonaire';
const createStageAdapter = (body: IStages) => {
  return {
    number: body.stage,
    life_save: body.lifeSaver,
    score: body.score,
    question: body.question,
  };
};
export default createStageAdapter;
