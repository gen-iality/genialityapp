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
   useEffect(() => {
      if (eventId) {
         listenSurveysData(eventId, setListOfEventSurveys, setLoadingSurveys, activity, currentUser);
      }
   }, [eventId]);

   useEffect(() => {
      const autoOpenSurvey = listOfEventSurveys[0];
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
      if (autoOpenSurvey?.length === 1 && autoOpenSurvey[0]?.isOpened === 'true') {
         setSurveyVisible(true);
      } else if (autoOpenSurvey?.length > 1 || autoOpenSurvey?.length === 0 || autoOpenSurvey === undefined) {
         setSurveyVisible(false);
      }
   }, [listOfEventSurveys, reloadNotification]);

   return <SurveyCard publishedSurveys={listOfEventSurveys[0]} loadingSurveys={loadingSurveys} />;
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
