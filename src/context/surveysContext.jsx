import { useEffect, useReducer, useMemo } from 'react';
import { listenSurveysData } from '../helpers/helperEvent';
import InitSurveysCompletedListener from '../components/events/surveys/functions/initSurveyCompletedListener';
import { UseEventContext } from './eventContext';
import { UseCurrentUser } from './userContext';
export const SurveysContext = React.createContext();

//status: 'LOADING' | 'LOADED' | 'error'
let initialContextState = {
  status: 'LOADING',
  surveys: [],
  currentSurvey: null,
  currentSurveyStatus: null,
  currentActivity: null,
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
        console.log('900.updatedcurrentSurvey', updatedcurrentSurvey);
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

    case 'survey_un_selected':
      return { ...state, currentSurvey: action.payload };

    case 'set_current_activity':
      return { ...state, currentActivity: action.payload };

    default:
      return newState;
  }
};

export function SurveysProvider({ children }) {
  //  console.group('surveyContext');
  let cEventContext = UseEventContext();
  let cUser = UseCurrentUser();
  const [state, dispatch] = useReducer(reducer, initialContextState);

  /** ACTION DISPACHERS **/
  function select_survey(survey) {
    dispatch({ type: 'survey_selected', payload: survey });
  }

  function unset_select_survey(survey) {
    dispatch({ type: 'survey_un_selected', payload: survey });
  }
  function set_current_activity(currentActivity) {
    dispatch({ type: 'set_current_activity', payload: currentActivity });
  }

  function shouldDisplaySurvey() {
    if (!state.currentSurvey) {
      return false;
    }
    console.log('state.currentSurvey', state.currentSurvey);
    return (
      (state.currentSurvey.isOpened === 'true' || state.currentSurvey.open === 'true') &&
      (state.currentSurvey.isPublished === 'true' || state.currentSurvey.publish === 'true') &&
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
    console.log('survey state', state)
    if (!state.currentSurveyStatus) {
      return true;
    }

    return state.currentSurveyStatus[state.currentSurvey._id]?.surveyCompleted !== 'completed';

    // If tried (in Firebase) is equal that tries (in MongoDB), then the user can see the survey
    const currentStatus = state.currentSurveyStatus[state.currentSurvey._id];
    if (!currentStatus) return true;
    console.debug('survey tries tried', state.currentSurvey?.tries, currentStatus.tried);
    return (currentStatus.tried || 0) < (state.currentSurvey?.tries || 1);
  }

  const surveyStatsString = useMemo(() => {
    // Beware of editing this without thinking
    if (!state.currentSurveyStatus || !state.currentSurvey) return 'cuestionario nuevo';
    const currentStatus = state.currentSurveyStatus[state.currentSurvey._id];
    if (!currentStatus) return 'cuestionario nuevo';

    const tried = currentStatus.tried || 0;
    return `${tried} ${tried > 1 ? 'intentos':'intento'} de ${state.currentSurvey?.tries || 1}`;
  }, [state.currentSurvey, state.currentSurveyStatus]);

  function shouldDisplayRanking() {
    if (!state.currentSurvey) {
      return false;
    }
    return state.currentSurvey.rankingVisible === 'true' || state.currentSurvey.rankingVisible === true;
  }

  function surveysToBeListedByActivity() {
    let listOfSurveysFilteredByActivity;
    if (state.currentActivity) {
      listOfSurveysFilteredByActivity =
        state.surveys &&
        state.surveys.filter(
          item => item.activity_id === state.currentActivity._id || item.isGlobal === 'true' || item.isGlobal === true,
        );
    }
    return listOfSurveysFilteredByActivity;
  }

  function shouldDisplaysurveyAssignedToThisActivity() {
    let recentlyOpenedSurvey;
    if (!state.currentSurvey && !surveysToBeListedByActivity()) {
      return false;
    }
    recentlyOpenedSurvey =
      surveysToBeListedByActivity() &&
      surveysToBeListedByActivity().filter(item => item?._id === state.currentSurvey?._id);

    if (recentlyOpenedSurvey && recentlyOpenedSurvey.length > 0) {
      return true;
    } else {
      return false;
    }
  }

  useEffect(() => {
    if (!cEventContext || !cEventContext.value) return;
    if (!cUser || !cUser.value) return;

    async function fetchSurveys() {
      //  console.log('surveyContext', 'inicialize');
      console.log('900. ESTE ES EL STATE', state);
      listenSurveysData(cEventContext.value._id, dispatch, cUser, null);
      InitSurveysCompletedListener(cUser, dispatch);
    }
    fetchSurveys();
  }, [cEventContext, cUser]);

  return (
    <SurveysContext.Provider
      value={{
        ...state,
        surveyStatsString,
        select_survey,
        unset_select_survey,
        set_current_activity,
        shouldDisplaySurvey,
        shouldDisplayGraphics,
        shouldDisplaySurveyAttendeeAnswered,
        shouldDisplaySurveyClosedMenssage,
        attendeeAllReadyAnswered,
        shouldDisplayRanking,
        surveysToBeListedByActivity,
        shouldDisplaysurveyAssignedToThisActivity,
      }}
    >
      {children}
    </SurveysContext.Provider>
  );
}

export function UseSurveysContext() {
  const contextsurveys = React.useContext(SurveysContext);
  console.log('contextsurveys', contextsurveys);
  if (!contextsurveys) {
    throw new Error('eventContext debe estar dentro del proveedor');
  }

  return contextsurveys;
}

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

//Si una encuesta esta publicada y esta abierta la seleccionamos automáticamente cómo activa
//Esto debería quedar en un mejor lugar
// if (querySnapshot.docChanges().length) {
//    let lastChange = querySnapshot.docChanges()[querySnapshot.docChanges().length - 1];
//    let currentSurvey = null;
//    switch (lastChange.type) {
//       case 'removed':
//       case 'added':
//          visualizarEncuesta(null);
//          break;
//       case 'modified':
//       default:
//          currentSurvey = { ...lastChange.doc.data(), _id: lastChange.doc.id };
//          visualizarEncuesta(currentSurvey);
//          break;
//    }
// }

// /** Permite abrir o cerrar la encuesta al cambiar el estado desde el cms */
// function visualizarEncuesta(survey) {
//   if (!survey) {
//     setCurrentSurvey(null);
//   }
//   if (survey && survey.isOpened === 'true' && survey !== null) {
//     if (currentActivity !== null && survey.isOpened === 'true') {
//       setSurveyResult('view');
//     } else if (currentActivity !== null && survey.isOpened === 'false') {
//       setSurveyResult('results');
//     }
//     setCurrentSurvey(survey);
//   } else {
//     setCurrentSurvey(survey);
//     setSurveyResult('closedSurvey');
//   }
// }

// /** Listener que permite obtener la data del estado de las encuestas, "abierto, cerrado, en progreso" */
// useEffect(() => {
//   if (cUser.value !== null) {
//     const unSuscribe = InitSurveysCompletedListener(cUser, props.setCurrentSurveyStatus);
//     return unSuscribe;
//   }
// }, [cUser]);

/** Listener para obtener todas las encuestas por lección */
// useEffect(() => {
//   if (currentActivity) {
//     listenSurveysData(eventId, setListOfEventSurveys, setLoadingSurveys, currentActivity, cUser, visualizarEncuesta);
//   }
// }, [currentActivity]);
