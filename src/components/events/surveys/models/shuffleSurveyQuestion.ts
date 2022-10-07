import { SurveyData, SurveyPreModel } from './types';
import { SurveyModel } from 'survey-react';

const getRandomIndex = (max: number) => Math.floor(Math.random() * max);

export default (survey: (SurveyData | SurveyPreModel) & SurveyModel) => {
  let newSurvey: SurveyData & SurveyModel = {} as any;

  if (survey.random_survey) {
    // To avoid foolishness
    const sampleCount = Math.min(survey.random_survey_count, survey.questions.length);
    console.debug('sampleCount', sampleCount);
    if (sampleCount < survey.questions.length) {
      const possibleIndeces: number[] = survey.questions.map((question, index) => index);
      const takenIndeces: number[] = [];
      // Take `sampleCount` question-indeces
      let taken = 0;
      let watchDog = 0;
      while (taken < sampleCount) {
        watchDog++;
        const index = getRandomIndex(possibleIndeces.length);
        if (!takenIndeces.includes(index)) {
          possibleIndeces.splice(index, 1); // like pop
          takenIndeces.push(index);
          taken++;
        }
        if (watchDog > survey.questions.length * 2) {
          console.error('tanking random index has crashed and the loop has overflowed the survey questions length');
          break;
        }
      }
      // Now, use these indeces to get the questions
      takenIndeces
      const newPages = survey.pages.filter((question: any, index: number) => takenIndeces.includes(index))
      newSurvey = { ...survey, pages: newPages } as any;
    } else {
      newSurvey = { ...survey } as any;
    }
  } else {
    newSurvey = { ...survey } as any;
  }
  
  console.debug('survey.survey', newSurvey);
  return newSurvey;
}
