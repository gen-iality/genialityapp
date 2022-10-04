import { useState, useReducer, useEffect } from 'react';
import { UseEventContext } from '@/context/eventContext';
import { UseCurrentUser } from '@/context/userContext';
import { GetCurrentUserSurveyStatus } from './functions/setCurrentUserSurveyStatus';

export const SurveyContext = React.createContext();

export function UseSurveyContext() {
  const contextsurvey = React.useContext(SurveyContext);
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
  let cUser = UseCurrentUser();

  const [state, dispatch] = useReducer(reducer, initialContextState);

  useEffect(() => {
    if (!cEventContext || !cEventContext.value) return;
    if (!cUser || !cUser.value) return;
    if (!state.currentSurvey) return;

    console.log('1000. Aquí se ejecuta el use Effect');

    GetCurrentUserSurveyStatus(state.currentSurvey._id, cUser.value._id).then(data => {
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
      }}
    >
      {children}
    </SurveyContext.Provider>
  );
}
