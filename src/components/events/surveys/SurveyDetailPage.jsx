import React from 'react';
import { connect } from 'react-redux';
import Graphics from './graphics';
import SurveyComponent from './surveyComponent';
import { Card } from 'antd';
import ClosedSurvey from './components/closedSurvey';

function SurveyDetailPage(props) {
   // const [hasVote, setHasVote] = useState(false);
   const { currentSurvey, currentUser, surveyResult } = props;

   if (!currentSurvey) {
      return <h1>No hay nada publicado</h1>;
   }

   return (
      <div>
         {/* (eventUser && eventUser.rol && eventUser.rol.name === currentSurvey.userRole) validacion por rol */}
         {surveyResult === 'results' && (
            <Graphics
               idSurvey={currentSurvey._id}
               // showListSurvey={toggleSurvey}
               eventId={currentSurvey.eventId}
               // surveyLabel={surveyLabel}
               operation='participationPercentage' //onlyCount, participationPercentage
            />
         )}
         {surveyResult === 'view' && (
            <Card title={`${currentSurvey.name}`} className='survyCard'>
               <SurveyComponent
                  // responseCounter={responseCounter}
                  idSurvey={currentSurvey._id}
                  // showListSurvey={toggleSurvey}
                  eventId={currentSurvey.eventId}
                  currentUser={currentUser}
                  singlePage={true}
                  // surveyLabel={surveyLabel}
                  operation='participationPercentage'
               />
               {/* <div>{surveySelected.name}</div> */}
            </Card>
         )}
         {surveyResult === 'closedSurvey' && <ClosedSurvey />}
      </div>
   );
}

const mapStateToProps = (state) => ({
   currentSurvey: state.survey.data.currentSurvey,
   isVisible: state.survey.data.surveyVisible,
   surveyResult: state.survey.data.result,
   currentUser: state.user.data,
});

export default connect(mapStateToProps)(SurveyDetailPage);
