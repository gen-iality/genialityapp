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
   surveyResult: 'view',
};

const reducer = (state, action) => {
   let newState = state;
   switch (action.type) {
      case 'data_loaded':
         newState = { ...state, surveys: action.payload.publishedSurveys, status: 'LOADED' };

         //Actualizamos el estado de la encuesta actual
         if (state.currentSurvey) {
            let updatedcurrentSurvey = action.payload.publishedSurveys.find(
               (item) => state.currentSurvey._id == item._id
            );
            newState['currentSurvey'] = updatedcurrentSurvey;
         }
         //validamos que encuesta cambio desde el cms para abrir el drawer
         if (action.payload.changeInSurvey) {
            if (
               action.payload.changeInSurvey.isOpened === 'true' &&
               action.payload.changeInSurvey.isPublished === 'true'
            ) {
               let changeInSurvey = newState.surveys.find((item) => item._id === action.payload.changeInSurvey._id);
               newState['currentSurvey'] = changeInSurvey;
               newState['surveyResult'] = 'view';
            } else {
               newState['surveyResult'] = 'results';
            }
         }
         return newState;

      case 'current_Survey_Status':
         return { ...state, currentSurveyStatus: action.payload };

      case 'survey_selected':
         if (action.payload.isOpened === 'true') {
            return { ...state, currentSurvey: action.payload, surveyResult: 'view' };
         } else if (action.payload.isOpened === 'false') {
            return { ...state, currentSurvey: action.payload, surveyResult: 'results' };
         }

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
      <SurveysContext.Provider value={{ ...state, select_survey, unset_select_survey }}>
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
