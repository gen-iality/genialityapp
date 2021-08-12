import React from 'react';
import { Button, Card, Result } from 'antd';
import { connect } from 'react-redux';
import * as surveysActions from '../../../../redux/survey/actions';
import { SmileOutlined } from '@ant-design/icons';

const { setSurveyResult } = surveysActions;

function ClosedSurvey(props) {
  const { currentSurvey, setSurveyResult } = props;
  return (
    <Card style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height:'80vh' }}>
      <Result
        icon={<SmileOutlined />}
        title={
          <h1>
            La encuesta &quot;<strong>{currentSurvey.name}</strong>&quot; ha finalizado
          </h1>
        }
        extra={
          <Button onClick={() => setSurveyResult('results')} type='primary' size='large' >
            Ir a resultados
          </Button>
        }
      />
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
