import { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import Graphics from './graphics';
import SurveyComponent from './surveyComponentV2';
import { Card, Result, Divider, Button } from 'antd';

import WithEviusContext from '@/context/withContext';
import LoadSelectedSurvey from './functions/loadSelectedSurvey';
import initRealTimeSurveyListening from './functions/initRealTimeSurveyListening';
import useSurveyQuery from './hooks/useSurveyQuery';

/** Context´s */
import { UseCurrentUser } from '@context/userContext';
import { UseSurveysContext } from '@context/surveysContext';

/** Components */
import ResultsPanel from './resultsPanel';

function SurveyDetailPage({ surveyId, cEvent }) {
  let cSurveys = UseSurveysContext();

  const currentUser = UseCurrentUser();

  const [loadedQuestions, setLoadedQuestions] = useState([]);
  const [answerdQuestions, setAnswerdQuestions] = useState([]);
  const [showingResultsPanel, setShowingResultsPanel] = useState(false);

  const [isSurveyFinished, setIsSurveyFinished] = useState(false);

  //Effect for when prop.idSurvey changes
  useEffect(() => {
    if (!surveyId) return;

    console.log('200.survey surveyid userid', surveyId, currentUser.value);
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

  function showResultsPanel() {
    setShowingResultsPanel(true);
  }

  if (!cSurveys.currentSurvey) {
    return <h1>No hay nada publicado, {surveyId}</h1>;
  }

  if (!cEvent || !surveyId) {
    return <h1>Cargando..</h1>;
  }
  return (
    <div>
      {true && <>
      hola. {isSurveyFinished ? 'finalizado' : 'no finalizado aún'}
      <br/>
      {JSON.stringify(loadedQuestions)}
      <hr/>
      {JSON.stringify(answerdQuestions)}
      </>}

      {cSurveys.shouldDisplaySurveyAttendeeAnswered() ? (
        <div>
          <Result
            style={{ height: '50%', padding: '75px' }}
            status='success'
            title='Ya has contestado esta evaluación'
          />
          <Button
            onClick={() => {
              showResultsPanel();
            }}
            type='primary'
            key='console'
          >
            Results
          </Button>
          {showingResultsPanel && (
            <ResultsPanel
              currentUser={currentUser}
              eventId={eventId}
              idSurvey={surveyId}
              queryData={queryData}
              operation='participationPercentage'
            />
          )}
        </div>
      ) : cSurveys.shouldDisplaySurveyClosedMenssage() ? (
        <Result title='Esta evaluación ha sido cerrada' />
      ) : cSurveys.shouldDisplayGraphics() ? (
        <>
          <Divider />
          <Graphics idSurvey={surveyId} eventId={cEvent._id} operation='participationPercentage' />
        </>
      ) : (
        <Card className='surveyCard'>
          <SurveyComponent
            idSurvey={surveyId}
            eventId={cEvent.value._id}
            cbMaskAsFinished={() => setIsSurveyFinished(true)}
            setLoadedQuestions={setLoadedQuestions}
            addAnswerdQuestion={(newAnswer) => {
              setAnswerdQuestions((previous) => ([...previous, newAnswer]))
            }}
          />
        </Card>
      )}
    </div>
  );
}

const mapStateToProps = (state) => ({
  isVisible: state.survey.data.surveyVisible,
});

export default connect(mapStateToProps)(WithEviusContext(SurveyDetailPage));
