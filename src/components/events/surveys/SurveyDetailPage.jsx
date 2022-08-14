import { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import Graphics from './graphics';
import SurveyComponent from './surveyComponent';
import { Card, Result, Divider } from 'antd';
import ClosedSurvey from './components/closedSurvey';
import { useHelper } from '@/context/helperContext/hooks/useHelper';

/** Context´s */
import { UseCurrentUser } from '../../../context/userContext';
import { UseSurveysContext } from '../../../context/surveysContext';
import { UseEventContext } from '../../../context/eventContext';


function SurveyDetailPage(props) {

  let cSurveys = UseSurveysContext();
  const currentUser = UseCurrentUser();

  const [showSurveyTemporarily, setShowSurveyTemporarily] = useState(false);

  let { currentActivity } = useHelper();

  useEffect(() => {
    if (showSurveyTemporarily === true) {
      setTimeout(() => {
        setShowSurveyTemporarily(false);
      }, 10000);
    }
  }, [showSurveyTemporarily]);


  //event_id = 62f863debc55ce1e6b689683

  // if (!cSurveys.currentSurvey) {
  //   return <Result title='No hay nada publicado' />;
  // }

  console.log('400. currentSurvey', cSurveys.currentSurvey);
  console.log('400. currentActivity', currentActivity);

  return (
    <div>
      {console.log('Este es el objeto Encuesta:', cSurveys)}
      {/* {cSurveys.shouldDisplaySurveyAttendeeAnswered() && (currentActivity.type.name === 'survey' ?
        <Result style={{ height: '50%', padding: '100px' }} status='success' title='Ya has contestado esta Encuesta' />
        : <Result style={{ height: '50%', padding: '100px' }} status='success' title='Ya has contestado este Quiz' />
      )}

      {cSurveys.shouldDisplaySurveyClosedMenssage() && (currentActivity.type.name === 'survey' ?
        <Result title='Esta encuesta ha sido cerrada' />
        : <Result title='Este quiz ha sido cerrado' />
      )} */}

      {/* {(cSurveys.shouldDisplaySurvey() || showSurveyTemporarily) && ( */}
        <Card className='survyCard'>
          {/* <SurveyComponent
            idSurvey={props.activityId ? cSurveys.surveys.filter(survey => survey.activity_id === props.activityId).map(survey => survey._id)[0] : cSurveys.currentSurvey._id}
            eventId={cSurveys.currentSurvey.eventId}
            currentUser={currentUser}
            setShowSurveyTemporarily={setShowSurveyTemporarily}
            operation='participationPercentage'
          /> */}
          <SurveyComponent
            idSurvey={"62f863debc55ce1e6b689683"}
            eventId={"62cef516a293dc537935b072"}
            currentUser={currentUser}
            setShowSurveyTemporarily={setShowSurveyTemporarily}
            operation='participationPercentage'
          />
        </Card>
      {/* // )} */}
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
