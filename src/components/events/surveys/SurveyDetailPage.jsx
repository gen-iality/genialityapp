import React from 'react';
import { connect } from 'react-redux';
import Graphics from './graphics';
import SurveyComponent from './surveyComponent';
import { Card } from 'antd';
import ClosedSurvey from './components/closedSurvey';

/** Context´s */
import { UseCurrentUser } from '../../../Context/userContext';

function SurveyDetailPage(props) {
  // const [hasVote, setHasVote] = useState(false);
  const { currentSurvey, surveyResult, currentSurveyStatus } = props;
  const currentUser = UseCurrentUser();

  if (!currentSurvey) {
    return <h1>No hay nada publicado</h1>;
  }

  const isCompleted = (id) => {
     console.log("Este nene se esta ejecutado",id)
    if (
      currentSurveyStatus &&
      currentSurveyStatus[id] &&
      currentSurveyStatus[id].surveyCompleted === 'completed' &&
      surveyResult !== 'closedSurvey'
    ) {
      return true;
    }
    return false;
  };

  return (
    <div>
     
      {(surveyResult === 'results' || isCompleted(currentSurvey._id)) && (
        <Graphics
          idSurvey={currentSurvey._id}
          // showListSurvey={toggleSurvey}
          eventId={currentSurvey.eventId}
          // surveyLabel={surveyLabel}
          operation='participationPercentage' //onlyCount, participationPercentage
        />
      )}
      {!isCompleted(currentSurvey._id) && (
        <Card className='survyCard'>
          <SurveyComponent
            idSurvey={currentSurvey._id}
            eventId={currentSurvey.eventId}
            currentUser={currentUser}
            operation='participationPercentage'
          />
        </Card>
      )}
      {surveyResult === 'closedSurvey' && <ClosedSurvey />}
    </div>
  );
}

const mapStateToProps = (state) => ({
  currentSurvey: state.survey.data.currentSurvey,
  isVisible: state.survey.data.surveyVisible,
  surveyResult: state.survey.data.result,
  currentSurveyStatus: state.survey.data.currentSurveyStatus,
});

export default connect(mapStateToProps)(SurveyDetailPage);
