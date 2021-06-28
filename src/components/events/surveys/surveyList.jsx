import React, { useEffect, useState } from 'react';

/** Helpers */
import { listenSurveysData } from '../../../helpers/helperEvent';

/** Redux */
import { connect } from 'react-redux';

/** Componentes */
import SurveyCard from './components/surveyCard';

function SurveyList(props) {
   const activity = props.activity;
   const cUser = props.currentUser;
   const eventId = activity.event_id;

   const [listOfEventSurveys, setListOfEventSurveys] = useState([]);
   const [loadingSurveys, setLoadingSurveys] = useState(true);

   useEffect(() => {
      if (eventId) {
        listenSurveysData(eventId, setListOfEventSurveys, setLoadingSurveys, activity, cUser)
      }
   }, [eventId]);

   return (
         <SurveyCard publishedSurveys={listOfEventSurveys} loadingSurveys={loadingSurveys} />
   );
}

const mapStateToProps = (state) => ({
   activity: state.stage.data.currentActivity,
   currentUser: state.user.data,
});

export default connect(mapStateToProps)(SurveyList);
