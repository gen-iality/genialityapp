import { useState, useEffect, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import { connect } from 'react-redux';
import Graphics from './graphics';
import SurveyComponent from './surveyComponentV2';
import { Card, Result, Divider, Button, Space } from 'antd';

import WithEviusContext from '@/context/withContext';
import LoadSelectedSurvey from './functions/loadSelectedSurvey';
import initRealTimeSurveyListening from './functions/initRealTimeSurveyListening';
import useSurveyQuery from './hooks/useSurveyQuery';
import useAsyncPrepareQuizStats from '@components/quiz/useAsyncPrepareQuizStats';
import { SurveysApi } from '@/helpers/request';

/** Context´s */
import { UseCurrentUser } from '@context/userContext';
import { UseSurveysContext } from '@context/surveysContext';

/** Components */
import ResultsPanel from './resultsPanel';
import QuizProgress from '@/components/quiz/QuizProgress';

function SurveyDetailPage({ surveyId, cEvent }) {
  const cSurveys = UseSurveysContext();

  const currentUser = UseCurrentUser();
  const history = useHistory();
  const handleGoToCertificate = useCallback(() => {
    history.push(`/landing/${cEvent.value?._id}/certificate`);
  }, [cEvent.value]);
  const [enableGoToCertificate, setEnableGoToCertificate] = useState(false);

  const [showingResultsPanel, setShowingResultsPanel] = useState(false);

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

  useEffect(() => {
    if (!cEvent.value?._id) return;
    if (!currentUser?.value?._id) return;

    (async () => {
      const surveys = await SurveysApi.byEvent(cEvent.value._id);

      let passed = 0;
      let notPassed = 0;

      for (let i = 0; i < surveys.length; i++) {
        const survey = surveys[i];
        const stats = await useAsyncPrepareQuizStats(cEvent.value._id, survey._id, currentUser?.value?._id, survey);

        console.debug(`stats: cEvent.value._id=${cEvent.value._id}, survey._id=${survey._id}, currentUser?.value?._id=${currentUser?.value?._id}, survey=${survey}`)
        console.debug('stats object:', stats);
        if (stats.minimum > 0) {
          if (stats.right >= stats.minimum) {
            passed = passed + 1;
          } else {
            notPassed = notPassed + 1;
          }
        }
      }

      if (passed === surveys.length) {
        setEnableGoToCertificate(true);
      } else {
        setEnableGoToCertificate(false);
      }
    })();
  }, [currentUser?.value?._id, cEvent.value]);

  if (!cEvent || !surveyId) {
    return <h1>Cargando..</h1>;
  }

  if (!cSurveys.currentSurvey) {
    return <h1>No hay nada publicado, {surveyId}</h1>;
  }

  return (
    <div>
      {cSurveys.shouldDisplaySurveyAttendeeAnswered() ? (
        <Space direction='vertical' size='middle' align='center' style={{ display: 'flex' }}>
          <Result
            style={{ height: '50%', padding: '75px 75px 20px' }}
            status='success'
            title='Ya has contestado esta evaluación'
          />
          <QuizProgress eventId={cEvent.value._id} userId={currentUser.value._id} surveyId={surveyId} />
          <Button
            onClick={() => {
              showResultsPanel();
            }}
            type='primary'
            key='console'
          >
            Ver mis respuestas
          </Button>
          {showingResultsPanel && (
            <ResultsPanel eventId={cEvent.value?._id} currentUser={currentUser} idSurvey={surveyId} />
          )}
          {enableGoToCertificate && (
            <Button type='primary' onClick={handleGoToCertificate}>
              Descargar certificado
            </Button>
          )}
        </Space>
      ) : cSurveys.shouldDisplaySurveyClosedMenssage() ? (
        <Result title='Esta evaluación ha sido cerrada' />
      ) : cSurveys.shouldDisplayGraphics() ? (
        <>
          <Divider />
          <Graphics idSurvey={surveyId} eventId={cEvent.value?._id} operation='participationPercentage' />
        </>
      ) : (
        <Card className='surveyCard'>
          <SurveyComponent idSurvey={surveyId} eventId={cEvent.value?._id} />
        </Card>
      )}
    </div>
  );
}

const mapStateToProps = (state) => ({
  isVisible: state.survey.data.surveyVisible,
});

export default connect(mapStateToProps)(WithEviusContext(SurveyDetailPage));
