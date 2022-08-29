import { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import Graphics from './graphics';
import SurveyComponent from './surveyComponent';
import { Card, Result, Divider } from 'antd';

import ClosedSurvey from './components/closedSurvey';
import WithEviusContext from '@/context/withContext';
import LoadSelectedSurvey from './functions/loadSelectedSurvey';
import initRealTimeSurveyListening from './functions/initRealTimeSurveyListening';

/** Context´s */
import { UseCurrentUser } from '../../../context/userContext';
import { UseSurveysContext } from '../../../context/surveysContext';

function SurveyDetailPage({ surveyId, cEvent }) {
  let cSurveys = UseSurveysContext();

  const currentUser = UseCurrentUser();
  const [showSurveyTemporarily, setShowSurveyTemporarily] = useState(false);

  //Effect for when prop.idSurvey changes
  useEffect(() => {
    if (!surveyId) return;

    console.log('survey surveyid userid', surveyId, currentUser.value);
    let unsubscribe;
    (async () => {
      let loadedSurvey = await LoadSelectedSurvey(cEvent.value._id, surveyId);
      //listener que nos permite saber los cambios de la encuesta en tiempo real
      unsubscribe = initRealTimeSurveyListening(surveyId, updateSurveyData);

      // Esto permite obtener datos para la grafica de gamificacion
      //UserGamification.getListPoints(eventId, setRankingList);
      //Se obtiene el EventUser para los casos que se necesite saber el peso voto
      //await getCurrentEvenUser(eventId, setEventUsers, setVoteWeight);
      function updateSurveyData(surveyConfig) {
        if (!surveyConfig) return;
        cSurveys.select_survey({ ...surveyConfig, ...loadedSurvey });
      }
    })();
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [surveyId]);

  useEffect(() => {
    if (showSurveyTemporarily === true) {
      setTimeout(() => {
        setShowSurveyTemporarily(false);
      }, 10000);
    }
  }, [showSurveyTemporarily]);

  if (!cSurveys.currentSurvey) {
    return <h1>No hay nada publicado{surveyId}</h1>;
  }

  if (!cEvent || !surveyId) {
    return <h1>Carga......{console.log('cevent', cEvent)}</h1>;
  }
  return (
    <div>
      {!cSurveys.shouldDisplaySurveyAttendeeAnswered() && (
        <Result style={{ height: '50%', padding: '0px' }} status='success' title='Ya has contestado esta evaluación' />
      )}
      {cSurveys.shouldDisplaySurveyClosedMenssage() && <Result title='Esta evaluación ha sido cerrada' />}

      <Card className='survyCard'>
        <SurveyComponent
          idSurvey={surveyId}
          eventId={cEvent.value._id}
          currentUser={currentUser}
          setShowSurveyTemporarily={setShowSurveyTemporarily}
          operation='participationPercentage'
        />
      </Card>

      {cSurveys.shouldDisplayGraphics() && (
        <>
          <Divider />
          <Graphics idSurvey={surveyId} eventId={cEvent._id} operation='participationPercentage' />
        </>
      )}
      {/* {cSurveys.surveyResult === 'closedSurvey' && <ClosedSurvey />} */}
    </div>
  );
}

const mapStateToProps = (state) => ({
  isVisible: state.survey.data.surveyVisible,
});

export default connect(mapStateToProps)(WithEviusContext(SurveyDetailPage));
