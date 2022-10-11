import { SurveyQuestion } from './types';
import { SurveyModel } from 'survey-react';

const getRandomIndex = (max: number) => Math.floor(Math.random() * max);

export default (surveyQuestions: SurveyQuestion[], isRandomSurvey: boolean, randomSurveyCount?: number) => {
  const newQuestions: SurveyQuestion[] = [];

  if (isRandomSurvey) {
    // To avoid foolishness
    const sampleCount = randomSurveyCount === undefined ? surveyQuestions.length : Math.min(randomSurveyCount, surveyQuestions.length);
    console.debug('sampleCount', sampleCount);
    if (sampleCount < surveyQuestions.length) {
      const possibleIndeces: number[] = surveyQuestions.map((question, index) => index);
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
        if (watchDog > surveyQuestions.length * 2) {
          console.error('tanking random index has crashed and the loop has overflowed the survey questions length');
          break;
        }
      }
      // Now, use these indeces to get the questions
      console.debug('takenIndeces', takenIndeces);
      newQuestions.push(...surveyQuestions.filter((question: any, index: number) => takenIndeces.includes(index)));
    } else {
      newQuestions.push(...surveyQuestions);
    }
  } else {
    newQuestions.push(...surveyQuestions);
  }
  
  console.debug('survey.survey', newQuestions);
  return newQuestions;
}
