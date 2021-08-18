import React from 'react';
import { connect } from 'react-redux';
import Graphics from './graphics';
import SurveyComponent from './surveyComponent';
import { Card } from 'antd';
import ClosedSurvey from './components/closedSurvey';

/** Context´s */
import { UseCurrentUser } from '../../../Context/userContext';
import { UseSurveysContext } from '../../../Context/surveysContext';

function SurveyDetailPage(props) {
   let cSurveys = UseSurveysContext();
   // const { surveyResult } = props;
   const currentUser = UseCurrentUser();

   if (!cSurveys.currentSurvey) {
      return <h1>No hay nada publicado</h1>;
   }

   /** Validacion que permite saber cuando un usuario ya contesto la encuesta para que no se le permita realizarla mas */
   const isCompleted = (id) => {
      if (
         cSurveys.currentSurveyStatus &&
         cSurveys.currentSurveyStatus[id] &&
         cSurveys.currentSurveyStatus[id].surveyCompleted === 'completed' &&
         cSurveys.surveyResult !== 'closedSurvey'
      ) {
         return true;
      }
      return false;
   };

   return (
      <div>
         {(cSurveys.surveyResult === 'results' || isCompleted(cSurveys.currentSurvey._id)) && (
            <Graphics
               idSurvey={cSurveys.currentSurvey._id}
               eventId={cSurveys.currentSurvey.eventId}
               operation='participationPercentage'
            />
         )}
         {cSurveys.surveyResult === 'view' && !isCompleted(cSurveys.currentSurvey._id) && (
            <Card className='survyCard'>
               <SurveyComponent
                  idSurvey={cSurveys.currentSurvey._id}
                  eventId={cSurveys.currentSurvey.eventId}
                  currentUser={currentUser}
                  operation='participationPercentage'
               />
            </Card>
         )}
         {cSurveys.surveyResult === 'closedSurvey' && <ClosedSurvey />}
      </div>
   );
}

const mapStateToProps = (state) => ({
   isVisible: state.survey.data.surveyVisible,
   // surveyResult: state.survey.data.result,
});

export default connect(mapStateToProps)(SurveyDetailPage);
