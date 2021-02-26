import React from 'react';
import { connect } from 'react-redux';
import { Card, Button } from 'antd';
import { unsetCurrentSurvey } from '../../../redux/survey/actions';
import { setMainStage } from '../../../redux/stage/actions';
function SurveyDetail(props) {
  const handleClick = () => {
    const { unsetCurrentSurvey, setMainStage } = props;
    unsetCurrentSurvey();
    setMainStage(null);
  };

  return (
    <Card title={props.currentSurvey.name}>
      <Button onClick={handleClick}>Volver al listado de encuestas</Button>
    </Card>
  );
}
const mapStateToProps = (state) => ({
  currentSurvey: state.survey.data.currentSurvey,
});

const mapDispatchToProps = {
  unsetCurrentSurvey,
  setMainStage,
};

export default connect(mapStateToProps, mapDispatchToProps)(SurveyDetail);
