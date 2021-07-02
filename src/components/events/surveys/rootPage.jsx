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
   const { idSurvey, currentSurvey, currentUser } = props;
   const { eventId, seeGraphsByRole, userRole } = currentSurvey;

   const loadData = async (idSurvey) => {
      if (idSurvey) {
         let eventUserdata = await getCurrentEvenUser(eventId);
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
      if (seeGraphsByRole === true) {
         loadData(idSurvey);
      }
   }, []);

   return (
      <div>
         {(eventUser && eventUser.rol && eventUser.rol.name === userRole) ||
         currentSurvey.isOpened === 'false' ||
         currentSurvey.isOpened === false ||
         hasVote ? (
            <>
               {/*Preparacion componente para los resultados*/}
               <Graphics
                  idSurvey={idSurvey}
                  // showListSurvey={toggleSurvey}
                  eventId={eventId}
                  // surveyLabel={surveyLabel}
                  operation='participationPercentage' //onlyCount, participationPercentage
               />
            </>
         ) : (
            <Card className='survyCard'>
               <SurveyComponent
                  // responseCounter={responseCounter}
                  idSurvey={idSurvey}
                  // showListSurvey={toggleSurvey}
                  eventId={eventId}
                  currentUser={currentUser}
                  singlePage={true}
                  // surveyLabel={surveyLabel}
                  operation='participationPercentage'
               />
            </Card>
         )}
      </div>
   );
}

const mapStateToProps = (state) => ({
   currentSurvey: state.survey.data.currentSurvey,
   idSurvey: state.survey.data.currentSurvey._id,
   currentUser: state.user.data,
});

export default connect(mapStateToProps)(RootPage);
