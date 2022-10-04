import { useState, useEffect } from 'react';
import LoadSelectedSurvey from './../functions/loadSelectedSurvey';
import initRealTimeSurveyListening from './../functions/initRealTimeSurveyListening';
import { SurveyPage } from '../services/services';
import { useCurrentUser } from '../../../../context/userContext';

////open, publish, freezeGame
function useSurveyQuery(eventId, idSurvey) {
  const currentUser = useCurrentUser();
  const [query, setQuery] = useState({ loading: true, error: false, data: undefined });
  const [innerQuery, setInnerQuery] = useState(undefined);
  const [innerRealTimeQuery, setInnerRealTimeQuery] = useState(undefined);

  async function getUserCurrentSurveyPage(idSurvey, userId) {
    let currentPageNo = 0;
    if (idSurvey && userId) {
      currentPageNo = await SurveyPage.getCurrentPage(idSurvey, userId);
    }
    return currentPageNo;
  }

  //Mixing realtime and notreal time into one to be exposed
  useEffect(() => {
    if (innerQuery === undefined || innerRealTimeQuery === undefined) return;
    console.log('prueba que no carga tanto');
    setQuery(prev => {
      return { ...prev, loading: false, data: { ...innerQuery, ...innerRealTimeQuery } };
    });
  }, [innerQuery, innerRealTimeQuery]);

  //no realtime Query
  useEffect(() => {
    const innerAsyncCall = async () => {
      let loadedSurvey = await LoadSelectedSurvey(eventId, idSurvey);
      //loadedSurvey.currentPage = 0;
      loadedSurvey.currentPage = await getUserCurrentSurveyPage(idSurvey, currentUser.value._id);
      console.log('500.innerAsyncCall loadedSurvey', loadedSurvey);
      setInnerQuery(loadedSurvey);
    };
    innerAsyncCall();
  }, [idSurvey]);

  //realtime Query
  useEffect(() => {
    function handleRealTimeCallback(surveyStatus) {
      console.log('500.handleRealTimeCallback surveyStatus', surveyStatus);
      setInnerRealTimeQuery(surveyStatus);
    }
    let unsuscribe = initRealTimeSurveyListening(idSurvey, handleRealTimeCallback);
    return () => {
      if (unsuscribe) unsuscribe();
    };
  }, [idSurvey]);

  return query;
}

export default useSurveyQuery;
