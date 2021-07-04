import React, { useEffect, useState } from 'react';

/** Helpers */
import { listenSurveysData } from '../../../helpers/helperEvent';

/** Redux */
import { connect } from 'react-redux';
import * as notificationsActions from '../../../redux/notifications/actions';
import * as surveysActions from '../../../redux/survey/actions';
import {setMainStage } from '../../../redux/stage/actions';

/** Componentes */
import SurveyCard from './components/surveyCard';
import notifications from '../Landing/notifications';

const { setNotification } = notificationsActions;
const { setSurveyVisible,setCurrentSurvey,unsetCurrentSurvey} = surveysActions;

function SurveyList(props) {
   const { activity, currentUser, setNotification, viewNotification, setSurveyVisible,surveySelected, setMainStage,unsetCurrentSurvey, setCurrentSurvey } = props;
   const eventId = activity.event_id;

   const [listOfEventSurveys, setListOfEventSurveys] = useState([]);
   const [loadingSurveys, setLoadingSurveys] = useState(true);
   const [reloadNotification, setReloadNotification] = useState(true);
  
   useEffect(() => {
      if (eventId) {
         console.log("10_If inicial")
         listenSurveysData(eventId, setListOfEventSurveys, setLoadingSurveys, activity, currentUser,visualizarEncuesta,surveySelected);
      }
   }, [eventId]);
// console.log("10_ listOfEventSurveys", listOfEventSurveys)

 const visualizarEncuesta=(survey)=>{
    console.log(survey)
   if (survey && survey.isOpened === 'true' && survey!=null) {      
    handleClick(survey)
   }else{
      setSurveyVisible(false)
   }
 }

 const handleClick=(currentSurvey)=> {
   if (activity !== null && currentSurvey.isOpened === 'true') {
      console.log("ENTRO A DETALLE")
      setMainStage('surveyDetalle'); 
      setSurveyVisible(true)
      setCurrentSurvey(currentSurvey)     
   }else{    
      setMainStage(null); 
      setSurveyVisible(false)
   } 
      
}
   useEffect(() => { 
        
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
   }, [listOfEventSurveys]);

   return <SurveyCard publishedSurveys={listOfEventSurveys[0]} loadingSurveys={loadingSurveys} currentSurvey={surveySelected} handleClick={handleClick} />;
}

const mapStateToProps = (state) => ({
   activity: state.stage.data.currentActivity,
   currentUser: state.user.data,
   viewNotification: state.notifications.data,
   currentActivity:state.survey.currentActivity,
   surveySelected:state.survey.data.currentSurvey
});

const mapDispatchToProps = {
   setNotification,   
   setSurveyVisible,
   setCurrentSurvey,
   setMainStage,
   unsetCurrentSurvey
};

export default connect(mapStateToProps, mapDispatchToProps)(SurveyList);
