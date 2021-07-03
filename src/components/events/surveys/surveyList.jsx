import React, { useEffect, useState } from 'react';

/** Helpers */
import { listenSurveysData } from '../../../helpers/helperEvent';

/** Redux */
import { connect } from 'react-redux';
import * as notificationsActions from '../../../redux/notifications/actions';
import * as surveysActions from '../../../redux/survey/actions';

/** Componentes */
import SurveyCard from './components/surveyCard';
import notifications from '../Landing/notifications';

const { setNotification } = notificationsActions;
const { setSurveyVisible } = surveysActions;

function SurveyList(props) {
   const { activity, currentUser, setNotification, viewNotification, setSurveyVisible } = props;
   const eventId = activity.event_id;

   const [listOfEventSurveys, setListOfEventSurveys] = useState([]);
   const [loadingSurveys, setLoadingSurveys] = useState(true);
   const [reloadNotification, setReloadNotification] = useState(true);
   const [currentSurvey, setCurrentSurvey] = useState(null);
   useEffect(() => {
      if (eventId && listOfEventSurveys?.length === 0) {

         console.log("10_If inicial")
         listenSurveysData(eventId, setListOfEventSurveys, setLoadingSurveys, activity, currentUser);
      }
   }, [eventId]);
// console.log("10_ listOfEventSurveys", listOfEventSurveys)
   useEffect(() => {
      const autoOpenSurvey = listOfEventSurveys[0];
      setCurrentSurvey(autoOpenSurvey)
      if (listOfEventSurveys[1]?.length >= 1) {
         setNotification({
            message: 'Encuestas abiertas',
            description: listOfEventSurveys[1],
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
      if (autoOpenSurvey && autoOpenSurvey[2]?.isOpened === 'true') {
         console.log("10_surveylist IF")
         setSurveyVisible(true);
      }
   }, [listOfEventSurveys, reloadNotification]);

   return <SurveyCard publishedSurveys={listOfEventSurveys[0]} loadingSurveys={loadingSurveys} currentSurvey={currentSurvey ? currentSurvey[2] : null} />;
}

const mapStateToProps = (state) => ({
   activity: state.stage.data.currentActivity,
   currentUser: state.user.data,
   viewNotification: state.notifications.data,
});

const mapDispatchToProps = {
   setNotification,
   setSurveyVisible,
};

export default connect(mapStateToProps, mapDispatchToProps)(SurveyList);
