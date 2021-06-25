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

const { setMainStage } = StageActions;
const { setCurrentSurvey, setSurveyVisible, unsetCurrentSurvey } = SurveyActions;

function SurveyList(props) {
   const [publishedSurveys, setPublishedSurveys] = useState([]);
   const [eventSurveys, setEventSurveys] = useState([]);

   console.log('SurveyList props ==> ', props);
   console.log('publishedSurveys ==> ', publishedSurveys);
   console.log('eventSurveys ==> ', eventSurveys);

   useEffect(() => {
     const eventSurveysList = listenSurveysData(props.activity.event_id).then((result)=>{ return result})
     console.log("eventSurveysList ===>",eventSurveysList)
      setEventSurveys(eventSurveys);

      if(eventSurveys){
        setPublishedSurveys(
          publishedSurveysByActivity(
             props.activity,
             eventSurveys,
             props.currentUser
          )
       );
      }
   }, []);

   return <SurveyCard />;
}

const mapStateToProps = (state) => ({
   event: state.event.data,
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
