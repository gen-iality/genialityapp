import React from 'react';
import { connect } from 'react-redux';
import Graphics from './graphics';
import SurveyComponent from './surveyComponent';
import { Card, Result } from 'antd';
import ClosedSurvey from './components/closedSurvey';

/** Context´s */
import { UseCurrentUser } from '../../../Context/userContext';
import { UseSurveysContext } from '../../../Context/surveysContext';

function SurveyDetailPage(props) {
   let cSurveys = UseSurveysContext();
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
         {cSurveys.shouldDisplaySurveyAttendeeAnswered() && (
            <Result status='success' title='Ya has contestado esta encuesta' />
         )}
         {cSurveys.shouldDisplaySurveyClosedMenssage() && <Result title='Esta encuesta ha sido cerrada' />}
         {/* {cSurveys.surveyResult === 'closedSurvey' && <ClosedSurvey />} */}
      </div>
   );
}

const mapStateToProps = (state) => ({
   isVisible: state.survey.data.surveyVisible,
});

export default connect(mapStateToProps)(SurveyDetailPage);
