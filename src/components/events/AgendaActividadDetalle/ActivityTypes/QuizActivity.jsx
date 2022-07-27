import { useState } from 'react';
import SurveyDetailPage from "../../surveys/SurveyDetailPage";
import HeaderColumnswithContext from '../HeaderColumns';


function QuizActivity() {

  const [activityState, setactivityState] = useState('');

  return (
    <>
      <HeaderColumnswithContext isVisible={true} activityState={activityState} />
      <SurveyDetailPage />
    </>
  )
}

export default QuizActivity