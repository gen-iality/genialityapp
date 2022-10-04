import { createContext, useContext, useMemo } from 'react';

import { ReactNode, useReducer, useEffect } from 'react';
import type { FunctionComponent } from 'react';
import { UseEventContext } from '@context/eventContext';
import { useCurrentUser } from '@context/userContext';
import { getUserSurveyStatus } from './functions/userSurveyStatus';

export enum SurveyContextAction {
  SURVEY_LOADED = 'SURVEY_LOADED',
  SURVEY_STATUS_LOADED = 'SURVEY_STATUS_LOADED',
  ANSWERING_AGAIN = 'ANSWERING_AGAIN',
}

export type SurveyContextReducerActionType =
| { type: SurveyContextAction.SURVEY_LOADED, survey: any }
| { type: SurveyContextAction.SURVEY_STATUS_LOADED, surveyStatus: any }
| { type: SurveyContextAction.ANSWERING_AGAIN, answering: any }

export type SurveyContextType = {
  status: string,
  survey: any,
  surveyStatus: any,
  answering: boolean,
};

export type CustomContextMethodType = {
  surveyStatsString: string,
  loadSurvey: (survey: any) => void,
  checkIfSurveyWasAnswered: () => boolean,
  shouldDisplaySurveyAttendeeAnswered: () => boolean,
  shouldDisplaySurveyClosedMenssage: () => boolean,
  shouldDisplayGraphics: () => boolean,
  shouldDisplayRanking: () => boolean,
  checkThereIsAnotherTry: () => boolean,
  startAnswering: () => void,
  stopAnswering: () => void,
};

const initialContextState: SurveyContextType = {
  status: 'LOADING',
  survey: null,
  surveyStatus: null,
  answering: false,
};

export const SurveyContext = createContext<SurveyContextType & CustomContextMethodType>({} as never);

export function useSurveyContext() {
  const contextsurvey = useContext(SurveyContext);

  if (!contextsurvey) {
    throw new Error('SurveyContext debe estar dentro del proveedor');
  }

  return contextsurvey;
}

function reducer(state: SurveyContextType, action: SurveyContextReducerActionType): SurveyContextType {
  switch (action.type) {
    case SurveyContextAction.SURVEY_LOADED:
      return { ...state, survey: action.survey, status: 'LOADED' };
    case SurveyContextAction.SURVEY_STATUS_LOADED:
      return { ...state, surveyStatus: action.surveyStatus };
    case SurveyContextAction.ANSWERING_AGAIN:
      return { ...state, answering: action.answering };
  }
}

export const SurveyProvider: FunctionComponent<{ children: ReactNode }> = ({ children }) => {
  let cEventContext = UseEventContext();
  let cUser = useCurrentUser();

  const [state, dispatch] = useReducer(reducer, initialContextState);

  useEffect(() => {
    if (!cEventContext || !cEventContext.value) return;
    if (!cUser || !cUser.value) return;
    if (!state.survey) return;

    console.log('1000. Aquí se ejecuta el use Effect');

    getUserSurveyStatus(state.survey._id, cUser.value._id).then((data) => {
      dispatch({ type: SurveyContextAction.SURVEY_STATUS_LOADED, surveyStatus: data });
    });
  }, [cEventContext, cUser, state.survey]);

  const loadSurvey = (survey: any) => {
    dispatch({ type: SurveyContextAction.SURVEY_LOADED, survey });
  };

  const checkIfSurveyWasAnswered = () => {
    if (!state.surveyStatus) {
      return false;
    }

    return state.surveyStatus?.surveyCompleted === 'completed';
  };

  const checkThereIsAnotherTry = () => {
    // If tried (in Firebase) is < that tries (in MongoDB), then the user can see the survey
    if (!state.survey || !state.surveyStatus) return true;
    console.debug(`survey tries:${state.survey.tries} tried:${state.surveyStatus.tried}`);
    return (state.surveyStatus.tried || 0) < (state.survey.tries || 1);
  };

  const startAnswering = () => {
    console.log('start answering again');
    if (checkThereIsAnotherTry()) dispatch({ type: SurveyContextAction.ANSWERING_AGAIN, answering: true });
  };

  const stopAnswering = () => {
    console.log('stop answering again');
    dispatch({ type: SurveyContextAction.ANSWERING_AGAIN, answering: false });
  };

  const shouldDisplaySurveyAttendeeAnswered = () => {
    if (checkThereIsAnotherTry() && state.answering) {
      return false;
    }
    return checkIfSurveyWasAnswered();
  };

  const shouldDisplaySurveyClosedMenssage = () => {
    if (!state.survey) {
      return false;
    }
    return state.survey.isOpened === 'false';
  };

  const shouldDisplayGraphics = () => {
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
  };

  const shouldDisplayRanking = () => {
    if (!state.survey) {
      return false;
    }
    return state.survey.rankingVisible === 'true' || state.survey.rankingVisible === true;
  };

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
