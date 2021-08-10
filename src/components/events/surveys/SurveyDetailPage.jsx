import React from 'react';
import { connect } from 'react-redux';
import Graphics from './graphics';
import SurveyComponent from './surveyComponent';
import { Card } from 'antd';
import ClosedSurvey from './components/closedSurvey';

/** Context´s */
import { UseCurrentUser } from '../../../Context/userContext';

function SurveyDetailPage(props) {
   // const [hasVote, setHasVote] = useState(false);
   const { currentSurvey, surveyResult,currentSurveyStatus } = props;
   const currentUser = UseCurrentUser();
 
  

   if (!currentSurvey) {
      return <h1>No hay nada publicado</h1>;
   }
   
   const isCompleted=(id)=>{
       if(currentSurveyStatus &&
      currentSurveyStatus[id] &&   currentSurveyStatus[id].surveyCompleted === 'completed' && surveyResult!=='closedSurvey'){
         return true;
      }
      return false;
   }

   return (
      <div>
         {/* (eventUser && eventUser.rol && eventUser.rol.name === currentSurvey.userRole) validacion por rol */}
         {console.log("COMPLETE=>",isCompleted(currentSurvey._id))}
         {console.log("RESULT==>"+surveyResult)}
         {(surveyResult === 'results' || isCompleted(currentSurvey._id)) && (
            <Graphics
               idSurvey={currentSurvey._id}
               // showListSurvey={toggleSurvey}
               eventId={currentSurvey.eventId}
               // surveyLabel={surveyLabel}
               operation='participationPercentage' //onlyCount, participationPercentage
            />
         )}
         {surveyResult === 'view' && !isCompleted(currentSurvey._id)  && (
            <Card className='survyCard'>
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
         {surveyResult === 'closedSurvey'  && <ClosedSurvey />}
      </div>
   );
}

const mapStateToProps = (state) => ({
   currentSurvey: state.survey.data.currentSurvey,
   isVisible: state.survey.data.surveyVisible,
   surveyResult: state.survey.data.result,
   currentSurveyStatus: state.survey.data.currentSurveyStatus,
});

export default connect(mapStateToProps)(SurveyDetailPage);
