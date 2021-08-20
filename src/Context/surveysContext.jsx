import React, { useState, useEffect, useReducer } from 'react';
import { useParams } from 'react-router-dom';
import { listenSurveysData } from '../helpers/helperEvent';
import InitSurveysCompletedListener from '../components/events/surveys/functions/initSurveyCompletedListener';
import { EventsApi } from '../helpers/request';
import { UseEventContext } from './eventContext';
import { UseCurrentUser } from './userContext';
export const SurveysContext = React.createContext();

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
            let updatedcurrentSurvey = action.payload.publishedSurveys.find(
               (item) => state.currentSurvey._id == item._id
            );
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
         (state.currentSurvey.allow_gradable_survey === 'false' || state.currentSurvey.allow_gradable_survey === false)
      );
   }

   function shouldDisplaySurveyClosedMenssage() {
      if (!state.currentSurvey) {
         return false;
      }
      return state.currentSurvey.isOpened === 'false';
   }
   function shouldDisplaySurveyAttendeeAnswered() {
      return (
         !attendeeAllReadyAnswered()
      );
   }

   function attendeeAllReadyAnswered() {
      if (!state.currentSurveyStatus) {
         return true;
      }

      return state.currentSurveyStatus[state.currentSurvey._id]?.surveyCompleted !== 'completed';
   }

   useEffect(() => {
      if (!cEventContext || !cEventContext.value) return;
      if (!cUser || !cUser.value) return;

      async function fetchSurveys() {
         //  console.log('surveyContext', 'inicialize');
         listenSurveysData(cEventContext.value._id, dispatch, cUser, null);
         InitSurveysCompletedListener(cUser, dispatch);
      }
      fetchSurveys();
   }, [cEventContext, cUser]);
   //  console.groupEnd('surveyContext');
   return (
      <SurveysContext.Provider
         value={{
            ...state,
            select_survey,
            unset_select_survey,
            shouldDisplaySurvey,
            shouldDisplayGraphics,
            shouldDisplaySurveyAttendeeAnswered,
            shouldDisplaySurveyClosedMenssage,
            attendeeAllReadyAnswered,
         }}>
         {children}
      </SurveysContext.Provider>
   );
}

export function UseSurveysContext() {
   const contextsurveys = React.useContext(SurveysContext);
   if (!contextsurveys) {
      throw new Error('eventContext debe estar dentro del proveedor');
   }

   return contextsurveys;
}
function name() {
   /** estados results o view*/
   // para ver la encuesta esta debe:
   //estar abierta
   //estar publicada
   //el estado para el usuario en la encuesta es diferente de completed
   //si es calificable no se muestran resultados para evitar fraude
   // contestada 'ya contestaste la encuesta'
   //si no es calificable se pueden mostrar graficas al final
}

function shouldActivateUpdatedSurvey(state, surveyChangedNew) {
   let shouldActivateSurvey = false;
   if (surveyChangedNew) {
      /** Se valida que el estado actual de la encuesta sea abierta y publicada */
      if (surveyChangedNew.isOpened === 'true' && surveyChangedNew.isPublished === 'true') {
         /** Se filtran la encuestas por id del array de encuestas en el estado anterior versus el id de la encuesta que se actualizo recientemente */
         let surveyChangedPrevius = state.surveys.find((item) => item._id === surveyChangedNew._id);
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

/** Listener para obtener todas las encuestas por actividad */
// useEffect(() => {
//   if (currentActivity) {
//     listenSurveysData(eventId, setListOfEventSurveys, setLoadingSurveys, currentActivity, cUser, visualizarEncuesta);
//   }
// }, [currentActivity]);
