import { createContext, useContext, useMemo } from 'react';

import { useState, useReducer, useEffect } from 'react';
import { UseEventContext } from '@context/eventContext';
import { useCurrentUser } from '@context/userContext';
import { getUserSurveyStatus } from './functions/userSurveyStatus';

export const SurveyContext = createContext();

export function useSurveyContext() {
  const contextsurvey = useContext(SurveyContext);
  // console.log('SurveyContext', contextsurvey);
  if (!contextsurvey) {
    throw new Error('SurveyContext debe estar dentro del proveedor');
  }
  return contextsurvey;
}

let initialContextState = {
  status: 'LOADING',
  survey: null,
  surveyStatus: null,
  answering: false,
};

function reducer(state, action) {
  switch (action.type) {
    case 'survey_loaded':
      return { ...state, survey: action.payload, status: 'LOADED' };
    case 'survey_status_loaded':
      return { ...state, surveyStatus: action.payload };
    case 'answering':
      return { ...state, answering: action.payload };
  }
}

export function SurveyProvider({ children }) {
  let cEventContext = UseEventContext();
  let cUser = useCurrentUser();

  const [state, dispatch] = useReducer(reducer, initialContextState);

  useEffect(() => {
    if (!cEventContext || !cEventContext.value) return;
    if (!cUser || !cUser.value) return;
    if (!state.survey) return;

    console.log('1000. Aquí se ejecuta el use Effect');

    getUserSurveyStatus(state.survey._id, cUser.value._id).then((data) => {
      dispatch({ type: 'survey_status_loaded', payload: data });
    });
  }, [cEventContext, cUser, state.survey]);

  function loadSurvey(survey) {
    dispatch({ type: 'survey_loaded', payload: survey });
  }

  function checkIfSurveyWasAnswered() {
    if (!state.surveyStatus) {
      return false;
    }

    return state.surveyStatus?.surveyCompleted === 'completed';
  }

  const checkThereIsAnotherTry = () => {
    // If tried (in Firebase) is < that tries (in MongoDB), then the user can see the survey
    if (!state.survey || !state.surveyStatus) return true;
    console.debug(`survey tries:${state.survey.tries} tried:${state.surveyStatus.tried}`);
    return (state.surveyStatus.tried || 0) < (state.survey.tries || 1);
  };

  const startAnswering = () => {
    console.log('start answering again');
    if (checkThereIsAnotherTry()) dispatch({ type: 'answering', payload: true });
  };

  const stopAnswering = () => {
    console.log('stop answering again');
    dispatch({ type: 'answering', payload: true });
  };

  function shouldDisplaySurveyAttendeeAnswered() {
    if (checkThereIsAnotherTry() && state.answering) {
      return false;
    }
    return checkIfSurveyWasAnswered();
  }

  function shouldDisplaySurveyClosedMenssage() {
    if (!state.survey) {
      return false;
    }
    return state.survey.isOpened === 'false';
  }

  function shouldDisplayGraphics() {
    if (!state.survey) {
      console.debug('not show graphics because there is no survey');
      return false;
    }

    if (!checkIfSurveyWasAnswered()) {
      console.debug('not show graphics because checkIfSurveyWasAnswered() is false');
    }

    if (state.survey.displayGraphsInSurveys === 'true' || state.survey.displayGraphsInSurveys === true) {
      console.debug('enable showing graphics');
      return true;
    }

    console.debug('not show graphics because survey.displayGraphsInSurveys is false');
    return false;
  }

  function shouldDisplayRanking() {
    if (!state.survey) {
      return false;
    }
    return state.survey.rankingVisible === 'true' || state.survey.rankingVisible === true;
  }

  const surveyStatsString = useMemo(() => {
    // Beware of editing this without thinking
    if (!state.surveyStatus || !state.survey) return 'cuestionario sin datos';

    const tried = state.surveyStatus.tried || 0;
    return `${tried} ${tried > 1 ? 'intentos':'intento'} de ${state.survey?.tries || 1}`;
  }, [state.survey, state.surveyStatus]);

  return (
    <SurveyContext.Provider
      value={{
        ...state,
        loadSurvey,
        checkIfSurveyWasAnswered,
        shouldDisplaySurveyAttendeeAnswered,
        shouldDisplaySurveyClosedMenssage,
        shouldDisplayGraphics,
        shouldDisplayRanking,
        surveyStatsString,
        checkThereIsAnotherTry,
        startAnswering,
        stopAnswering,
      }}
    >
      {children}
    </SurveyContext.Provider>
  );
}
