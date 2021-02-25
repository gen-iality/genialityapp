import React from 'react';
import { connect } from 'react-redux';
import { Card, Button } from 'antd';
import { unsetCurrentSurvey } from '../../../redux/survey/actions';
function SurveyDetail(props) {
  return (
    <Card title={props.currentSurvey.name}>
      <Button onClick={props.unsetCurrentSurvey}>Volver al listado de encuestas</Button>
    </Card>
  );
}
const mapStateToProps = (state) => ({
  currentSurvey: state.survey.data.currentSurvey,
});

const mapDispatchToProps = {
  unsetCurrentSurvey,
};

export default connect(mapStateToProps, mapDispatchToProps)(SurveyDetail);
