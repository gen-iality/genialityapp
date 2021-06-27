import React, { useEffect, useState } from 'react';
/** Helpers */
import { Actions, TicketsApi } from '../../../helpers/request';
import { publishedSurveysByActivity, listenSurveysData } from '../../../helpers/helperEvent';

/** Obtener cookies */
import * as Cookie from 'js-cookie';

/** Redux */
import { connect } from 'react-redux';
import * as StageActions from '../../../redux/stage/actions';
import * as SurveyActions from '../../../redux/survey/actions';

/** Listado de cards con las encuestas */
import SurveyCard from './components/surveyCard';

/** Firebase */
import { firestore } from '../../../helpers/firebase';
import { result } from 'lodash-es';
import { setTimeout } from 'core-js';

const { setMainStage } = StageActions;
const { setCurrentSurvey, setSurveyVisible, unsetCurrentSurvey } = SurveyActions;

function SurveyList(props) {
   const activity = props.activity;
   const cUser = props.currentUser;
   const eventId = activity.event_id;

   const [publishedSurveys, setPublishedSurveys] = useState([]);
   const [loading, setLoading] = useState(false);
   const [loadingSurveys, setLoadingSurveys] = useState(true);
   // console.log("10_",publishedSurveys,"==>",loading,"===>>",loadingSurveys)
   /** Listado total de las encuestas por id del evento */
   async function surveysListByEvent(eventId, listPublishedSurveysByActivity) {
      const surveysList = await listenSurveysData(eventId);

      if (surveysList.length !== 0) {
         listPublishedSurveysByActivity(activity, surveysList, cUser);
         setLoading(true);
         setLoadingSurveys(true);
      }
   }

   /** Listado de de encuestas por actividad */
   async function listPublishedSurveysByActivity(activity, eventSurveys, cUser) {
      const activitySurveysList = await publishedSurveysByActivity(activity, eventSurveys, cUser);
      if (activitySurveysList.length !== 0) {
         setPublishedSurveys(activitySurveysList);
         setLoading(false);
         setLoadingSurveys(false);
      }
   }
   /** callBack para ejecutar las funciones de listado de encuesta de forma asincrona */
   function callbackPublichedSurveys(surveysListByEvent, listPublishedSurveysByActivity) {
      surveysListByEvent(eventId, listPublishedSurveysByActivity);
   }

   useEffect(() => {
      if (eventId && loadingSurveys) {
         callbackPublichedSurveys(surveysListByEvent, listPublishedSurveysByActivity);
      }
   }, []);

   return (
      <>
         <SurveyCard publishedSurveys={publishedSurveys} loading={loading} loadingSurveys={loadingSurveys} />
      </>
   );
}

const mapStateToProps = (state) => ({
   activity: state.stage.data.currentActivity,
   currentUser: state.user.data,
});

const mapDispatchToProps = {
   setMainStage,
   setCurrentSurvey,
   setSurveyVisible,
   unsetCurrentSurvey,
};

export default connect(mapStateToProps, mapDispatchToProps)(SurveyList);
