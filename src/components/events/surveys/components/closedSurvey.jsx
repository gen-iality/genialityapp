import React from 'react';
import { Button, Card } from 'antd';
import { connect } from 'react-redux';
import * as surveysActions from '../../../../redux/survey/actions';

const { setSurveyResult } = surveysActions;

function ClosedSurvey(props) {
    const { currentSurvey, setSurveyResult } = props;
   return (
      <Card className='survyCard'>
         <h1>
            La <strong>{currentSurvey.name}</strong> ha finalizado
         </h1>
         <Button onClick={() => setSurveyResult('results')}>Ir a resultados</Button>
      </Card>
   );
}
const mapStateToProps = (state) => ({
    currentSurvey: state.survey.data.currentSurvey,
 });
const mapDispatchToProps = {
   setSurveyResult,
};
export default connect(mapStateToProps, mapDispatchToProps)(ClosedSurvey);
