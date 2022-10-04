import { createContext, useContext, useMemo } from 'react';

import { useState, useReducer, useEffect } from 'react';
import { UseEventContext } from '@/context/eventContext';
import { useCurrentUser } from '@/context/userContext';
import { getCurrentUserSurveyStatus } from './functions/setCurrentUserSurveyStatus';

export const SurveyContext = createContext();

export function useSurveyContext() {
  const contextsurvey = useContext(SurveyContext);
  console.log('SurveyContext', contextsurvey);
  if (!contextsurvey) {
    throw new Error('SurveyContext debe estar dentro del proveedor');
  }
  return contextsurvey;
}

let initialContextState = {
  status: 'LOADING',
  currentSurvey: null,
  currentSurveyStatus: null,
};

function reducer(state, action) {
  switch (action.type) {
    case 'survey_loaded':
      return { ...state, currentSurvey: action.payload, status: 'LOADED' };
    case 'survey_status_loaded':
      return { ...state, currentSurveyStatus: action.payload };
  }
}

export function SurveyProvider({ children }) {
  let cEventContext = UseEventContext();
  let cUser = useCurrentUser();

  const [state, dispatch] = useReducer(reducer, initialContextState);

  useEffect(() => {
    if (!cEventContext || !cEventContext.value) return;
    if (!cUser || !cUser.value) return;
    if (!state.currentSurvey) return;

    console.log('1000. Aquí se ejecuta el use Effect');

    getCurrentUserSurveyStatus(state.currentSurvey._id, cUser.value._id).then(data => {
      dispatch({ type: 'survey_status_loaded', payload: data });
    });
  }, [cEventContext, cUser, state.currentSurvey]);

  function load_survey(survey) {
    dispatch({ type: 'survey_loaded', payload: survey });
  }

  function attendeeAllReadyAnswered() {
    if (!state.currentSurveyStatus) {
      return false;
    }

    return state.currentSurveyStatus?.surveyCompleted === 'completed';
  }

  function shouldDisplaySurveyAttendeeAnswered() {
    return attendeeAllReadyAnswered();
  }

  function shouldDisplaySurveyClosedMenssage() {
    if (!state.currentSurvey) {
      return false;
    }
    return state.currentSurvey.isOpened === 'false';
  }

  function shouldDisplayGraphics() {
    if (!state.currentSurvey) {
      return false;
    }

    return (
      attendeeAllReadyAnswered() &&
      (state.currentSurvey.displayGraphsInSurveys === 'true' || state.currentSurvey.displayGraphsInSurveys === true)
    );
  }

  function shouldDisplayRanking() {
    if (!state.currentSurvey) {
      return false;
    }
    return state.currentSurvey.rankingVisible === 'true' || state.currentSurvey.rankingVisible === true;
  }

  const surveyStatsString = useMemo(() => {
    // Beware of editing this without thinking
    if (!state.currentSurveyStatus || !state.currentSurvey) return 'cuestionario nuevo';
    const currentStatus = state.currentSurveyStatus[state.currentSurvey._id];
    if (!currentStatus) return 'cuestionario nuevo';

    const tried = currentStatus.tried || 0;
    return `${tried} ${tried > 1 ? 'intentos':'intento'} de ${state.currentSurvey?.tries || 1}`;
  }, [state.currentSurvey, state.currentSurveyStatus]);

  return (
    <SurveyContext.Provider
      value={{
        ...state,
        load_survey,
        attendeeAllReadyAnswered,
        shouldDisplaySurveyAttendeeAnswered,
        shouldDisplaySurveyClosedMenssage,
        shouldDisplayGraphics,
        shouldDisplayRanking,
        surveyStatsString,
      }}
    >
      {children}
    </SurveyContext.Provider>
  );
}
