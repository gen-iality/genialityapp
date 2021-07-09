import React, { useEffect, useState } from 'react';

/** Helpers */
import { listenSurveysData } from '../../../helpers/helperEvent';

/** Redux */
import { connect } from 'react-redux';
import * as notificationsActions from '../../../redux/notifications/actions';
import * as surveysActions from '../../../redux/survey/actions';
import { setMainStage } from '../../../redux/stage/actions';

/** Componentes */
import SurveyCard from './components/surveyCard';
import notifications from '../Landing/notifications';

const { setNotification } = notificationsActions;
const { setCurrentSurvey, setSurveyResult } = surveysActions;

function SurveyList(props) {
   const {
      activity,
      currentUser,
      setNotification,
      viewNotification,
      surveySelected,
      setMainStage,
      setCurrentSurvey,
      setSurveyResult,
   } = props;
   const eventId = activity.event_id;

   const [listOfEventSurveys, setListOfEventSurveys] = useState([]);
   const [loadingSurveys, setLoadingSurveys] = useState(true);
   const [reloadNotification, setReloadNotification] = useState(true);

   useEffect(() => {
      if (eventId) {
         listenSurveysData(
            eventId,
            setListOfEventSurveys,
            setLoadingSurveys,
            activity,
            currentUser,
            visualizarEncuesta,
            surveySelected
         );
      }
   }, [eventId]);

   const visualizarEncuesta = (survey) => {
      if (survey && survey.isOpened === 'true' && survey !== null) {
         handleClick(survey);
      } else {
         setCurrentSurvey(survey);
         setSurveyResult('closedSurvey')
      }
   };

   const handleClick = (currentSurvey) => {
      if (activity !== null && currentSurvey.isOpened === 'true') {
         // setMainStage('surveyDetalle');
         // setSurveyVisible(true);
         setSurveyResult('view');
      } else if (activity !== null && currentSurvey.isOpened === 'false') {
         setSurveyResult('results');
         // setMainStage('surveyDetalle');
         // setSurveyVisible(true);
      }
      setCurrentSurvey(currentSurvey);
   };
   useEffect(() => {
      if (listOfEventSurveys[1]?.length >= 1) {
         setNotification({
            message: 'Encuestas abiertas',
            description: listOfEventSurveys[1].name,
            type: 'survey',
         });
         if (viewNotification.type !== null) {
            notifications(setNotification, viewNotification);
            setNotification({
               message: null,
               type: null,
            });
         }
         if (viewNotification.type === null) {
            setReloadNotification(!reloadNotification);
         }
      }
   }, [listOfEventSurveys, reloadNotification]);

   return (
      <SurveyCard
         publishedSurveys={listOfEventSurveys[0]}
         loadingSurveys={loadingSurveys}
         currentSurvey={surveySelected}
         handleClick={handleClick}
      />
   );
}

const mapStateToProps = (state) => ({
   activity: state.stage.data.currentActivity,
   currentUser: state.user.data,
   viewNotification: state.notifications.data,
   currentActivity: state.survey.currentActivity,
   surveySelected: state.survey.data.currentSurvey,
});

const mapDispatchToProps = {
   setNotification,
   setCurrentSurvey,
   setMainStage,
   setSurveyResult,
};

export default connect(mapStateToProps, mapDispatchToProps)(SurveyList);
