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

   return (
      <div>
         {cSurveys.shouldDisplayGraphics() && (
            <Graphics
               idSurvey={cSurveys.currentSurvey._id}
               eventId={cSurveys.currentSurvey.eventId}
               operation='participationPercentage'
            />
         )}
         {cSurveys.shouldDisplaySurvey() && (
            <Card className='survyCard'>
               <SurveyComponent
                  idSurvey={cSurveys.currentSurvey._id}
                  eventId={cSurveys.currentSurvey.eventId}
                  currentUser={currentUser}
                  operation='participationPercentage'
               />
            </Card>
         )}
         {!cSurveys.attendeeAllReadyAnswered() && !cSurveys.shouldDisplayGraphics() && (
            <h1>Ya se contesto la encuesta</h1>
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
