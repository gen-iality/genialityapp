import { useEffect, useReducer } from 'react';
import { listenSurveysData } from '@/helpers/helperEvent';
import InitSurveysCompletedListener from '@/components/events/surveys/functions/initSurveyCompletedListener';
import { UseEventContext } from '@/context/eventContext';
import { UseCurrentUser } from '@/context/userContext';
export const SurveyContext = React.createContext();

export function UseSurveyContext() {
  const contextsurvey = React.useContext(SurveyContext);
  console.log('SurveyContext', contextsurvey);
  if (!contextsurvey) {
    throw new Error('SurveyContext debe estar dentro del proveedor');
  }
  return contextsurvey;
}

//status: 'LOADING' | 'LOADED' | 'error'
let initialContextState = {
  status: 'LOADING',
  surveys: [],
  currentSurvey: null,
  currentSurveyStatus: null,
};

const reducer = (state, action) => {
  let newState = state;
  let surveyChangedNew = null;

  switch (action.type) {
    case 'data_loaded':
      newState = { ...state, surveys: action.payload.publishedSurveys, status: 'LOADED' };
      //Actualizamos el estado de la encuesta actual o se borra la encuesta actual si se despublico
      if (state.currentSurvey) {
        let updatedcurrentSurvey = action.payload.publishedSurveys.find(item => state.currentSurvey._id == item._id);
        newState['currentSurvey'] = updatedcurrentSurvey;
      }

      surveyChangedNew = action.payload.changeInSurvey;
      if (shouldActivateUpdatedSurvey(state, surveyChangedNew)) {
        newState['currentSurvey'] = surveyChangedNew;
      }
      return newState;

    case 'current_Survey_Status':
      return { ...state, currentSurveyStatus: action.payload };

    case 'survey_selected':
      return { ...state, currentSurvey: action.payload };

    default:
      return newState;
  }
};

function shouldActivateUpdatedSurvey(state, surveyChangedNew) {
  let shouldActivateSurvey = false;
  if (surveyChangedNew) {
    /** Se valida que el estado actual de la encuesta sea abierta y publicada */
    if (surveyChangedNew.isOpened === 'true' && surveyChangedNew.isPublished === 'true') {
      /** Se filtran la encuestas por id del array de encuestas en el estado anterior versus el id de la encuesta que se actualizo recientemente */
      let surveyChangedPrevius = state.surveys.find(item => item._id === surveyChangedNew._id);
      // newState['surveyResult'] = 'view';

      /** Si la comparacion anterior da undefined es por la encuesta estaba abierta pero despublicada por ello se niega el surveyChanged, de lo contrario se valida que este cerrada o despublicada */
      if (
        !surveyChangedPrevius ||
        surveyChangedPrevius.isOpened === 'false' ||
        surveyChangedPrevius.isPublished === 'false'
      ) {
        shouldActivateSurvey = true;
      }
    }
  }
  return shouldActivateSurvey;
}

export function SurveyProvider({ children }) {
  let cEventContext = UseEventContext();
  let cUser = UseCurrentUser();

  const [state, dispatch] = useReducer(reducer, initialContextState);

  useEffect(() => {
    if (!cEventContext || !cEventContext.value) return;
    if (!cUser || !cUser.value) return;

    async function fetchSurveys() {
      console.log('ESTE ES EL STATE', state);
      listenSurveysData(cEventContext.value._id, dispatch, cUser, null);
      InitSurveysCompletedListener(cUser, dispatch);
    }
    fetchSurveys();
  }, [cEventContext, cUser]);

  /** ACTION DISPACHERS **/
  function select_current_survey(survey) {
    dispatch({ type: 'survey_selected', payload: survey });
  }

  function shouldDisplaySurvey() {
    if (!state.currentSurvey) {
      return false;
    }
    return (
      state.currentSurvey.isOpened === 'true' &&
      state.currentSurvey.isPublished === 'true' &&
      attendeeAllReadyAnswered()
    );
  }

  function shouldDisplayGraphics() {
    if (!state.currentSurvey) {
      return false;
    }

    return (
      !shouldDisplaySurvey() &&
      // state.currentSurvey.allow_gradable_survey === 'false' ||
      // state.currentSurvey.allow_gradable_survey === false ||
      (state.currentSurvey.displayGraphsInSurveys === 'true' || state.currentSurvey.displayGraphsInSurveys === true)
    );
  }

  function shouldDisplaySurveyClosedMenssage() {
    if (!state.currentSurvey) {
      return false;
    }
    return state.currentSurvey.isOpened === 'false';
  }

  function shouldDisplaySurveyAttendeeAnswered() {
    return !attendeeAllReadyAnswered();
  }

  function attendeeAllReadyAnswered() {
    if (!state.currentSurveyStatus) {
      return true;
    }

    return state.currentSurveyStatus[state.currentSurvey._id]?.surveyCompleted !== 'completed';
  }

  function shouldDisplayRanking() {
    if (!state.currentSurvey) {
      return false;
    }
    return state.currentSurvey.rankingVisible === 'true' || state.currentSurvey.rankingVisible === true;
  }

  //  console.groupEnd('surveyContext');
  return (
    <SurveyContext.Provider
      value={{
        ...state,
        select_current_survey,
        shouldDisplaySurvey,
        shouldDisplayGraphics,
        shouldDisplaySurveyAttendeeAnswered,
        shouldDisplaySurveyClosedMenssage,
        attendeeAllReadyAnswered,
        shouldDisplayRanking,
      }}
    >
      {children}
    </SurveyContext.Provider>
  );
}
