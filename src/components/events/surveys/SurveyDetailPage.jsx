import { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import Graphics from './graphics';
import SurveyComponent from './surveyComponent';
import { Card, Result, Divider } from 'antd';
import ClosedSurvey from './components/closedSurvey';

/** Context´s */
import { UseCurrentUser } from '../../../context/userContext';
import { UseSurveysContext } from '../../../context/surveysContext';
import { UseUserEvent } from '@context/eventUserContext';
function SurveyDetailPage(props) {
  let cSurveys = UseSurveysContext();
  const currentUser = UseCurrentUser();
  const cEventUser = UseUserEvent();
  const [showSurveyTemporarily, setShowSurveyTemporarily] = useState(false);

  useEffect(() => {
    if (showSurveyTemporarily === true) {
      setTimeout(() => {
        setShowSurveyTemporarily(false);
      }, 10000);
    }
  }, [showSurveyTemporarily]);

  if (!cSurveys.currentSurvey) {
    return <h1>No hay nada publicado</h1>;
  }

  return (
    <div>
      {cSurveys.shouldDisplaySurveyAttendeeAnswered() && (
        <Result style={{ height: '50%', padding: '0px' }} status='success' title='Ya has contestado esta encuesta' />
      )}
      {cSurveys.shouldDisplaySurveyClosedMenssage() && <Result title='Esta encuesta ha sido cerrada' />}
      {(cSurveys.shouldDisplaySurvey() || showSurveyTemporarily) && (
        <Card className='survyCard'>
          <SurveyComponent
            idSurvey={cSurveys.currentSurvey._id}
            eventId={cSurveys.currentSurvey.eventId}
            cEventUser={cEventUser}
            currentUser={currentUser}
            setShowSurveyTemporarily={setShowSurveyTemporarily}
            operation='participationPercentage'
          />
        </Card>
      )}
      {cSurveys.shouldDisplayGraphics() && (
        <>
          <Divider />
          <Graphics
            idSurvey={cSurveys.currentSurvey._id}
            eventId={cSurveys.currentSurvey.eventId}
            operation='participationPercentage'
          />
        </>
      )}
      {/* {cSurveys.surveyResult === 'closedSurvey' && <ClosedSurvey />} */}
    </div>
  );
}

const mapStateToProps = (state) => ({
  isVisible: state.survey.data.surveyVisible,
});

export default connect(mapStateToProps)(SurveyDetailPage);
