import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import * as Cookie from 'js-cookie';
import { TicketsApi } from '../../../helpers/request';
import { SurveyAnswers } from './services';

import Graphics from './graphics';
import SurveyComponent from './surveyComponent';

import { Card } from 'antd';

function RootPage(props) {
   const [hasVote, setHasVote] = useState(false);
   const [eventUser, setEventUser] = useState({});
   const { currentSurvey, currentUser, isVisible, surveyResult } = props;
   const [surveySelected, setSurveySelected] = useState(null);
   const [results, setResults] = useState(false);

   const loadData = async (idSurvey) => {
      if (idSurvey && currentSurvey !== null) {
         let eventUserdata = await getCurrentEvenUser(idSurvey);
         setEventUser(eventUserdata);
      }
   };
   const getCurrentEvenUser = async (eventId) => {
      let evius_token = Cookie.get('evius_token');
      if (!evius_token) return null;
      let response = await TicketsApi.getByEvent(eventId, evius_token);
      return response && response.data.length ? response.data[0] : null;
   };

   useEffect(() => {
      if (currentSurvey !== null && currentSurvey.seeGraphsByRole === true) {
         loadData(surveySelected.eventId);
      }
   }, []);
   useEffect(() => {
      if (isVisible) {
         setSurveySelected(currentSurvey);
         setResults(surveyResult);
      } else {
         setSurveySelected(null);
      }
   }, [currentSurvey, isVisible, surveyResult]);

   return (
      <div>
         {(eventUser && eventUser.rol && eventUser.rol.name === currentSurvey.userRole) ||
         (surveySelected !== null &&
            (surveySelected.isOpened === 'false' || surveySelected.isOpened === false) &&
            results === true &&
            // hasVote === true &&
            (surveySelected.isPublished == 'true' || surveySelected.isPublished === true)) ? (
            <>
               {/*Preparacion componente para los resultados*/}
               <Graphics
                  idSurvey={surveySelected._id}
                  // showListSurvey={toggleSurvey}
                  eventId={currentSurvey != null && currentSurvey.eventId}
                  // surveyLabel={surveyLabel}
                  operation='participationPercentage' //onlyCount, participationPercentage
               />
            </>
         ) : surveySelected !== null &&
           (surveySelected.isOpened === 'true' || surveySelected.isOpened === true || hasVote) &&
           (surveySelected.isPublished == 'true' || surveySelected.isPublished == true) ? (
            <Card title={`${currentSurvey.name}`} className='survyCard'>
               <SurveyComponent
                  // responseCounter={responseCounter}
                  idSurvey={surveySelected._id}
                  // showListSurvey={toggleSurvey}
                  eventId={currentSurvey.eventId}
                  currentUser={currentUser}
                  singlePage={true}
                  // surveyLabel={surveyLabel}
                  operation='participationPercentage'
               />
               {/* <div>{surveySelected.name}</div> */}
            </Card>
         ) : (
            currentSurvey !== null &&
            results === false && (
               <Card title={`${currentSurvey.name}`} className='survyCard'>
                  <div>La encuesta ha sido cerrada</div>
               </Card>
            )
         )}
      </div>
   );
}

const mapStateToProps = (state) => ({
   currentSurvey: state.survey.data.currentSurvey,
   isVisible: state.survey.data.surveyVisible,
   surveyResult: state.survey.data.result,
   // idSurvey: state.survey.data.currentSurvey._id,
   currentUser: state.user.data,
});

export default connect(mapStateToProps)(RootPage);
