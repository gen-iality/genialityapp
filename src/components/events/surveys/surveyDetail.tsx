import { connect } from 'react-redux';
import { Card, Button } from 'antd';
import { unsetCurrentSurvey } from '../../../redux/survey/actions';
import { setMainStage } from '../../../redux/stage/actions';
import RankingTrivia from './rankingTrivia';
import { ArrowLeftOutlined } from '@ant-design/icons';

function SurveyDetail(props: any) {
  const handleClick = () => {
    const { unsetCurrentSurvey, setMainStage } = props;
    unsetCurrentSurvey();
    setMainStage(null);
  };

  //hasRanking -> Parametro para cuando se cree en CMS la opcion de seleccionar el ranking
  const hasRanking = true;

  return (
    <Card>
      <Button
        style={{ backgroundColor: '#1cdcb7', color: '#ffffff' }}
        size='large'
        icon={<ArrowLeftOutlined />}
        block
        onClick={handleClick}>
        Volver al listado de encuestas
      </Button>
    </Card>
  );
}
const mapStateToProps = (state: any) => ({
  currentSurvey: state.survey.data.currentSurvey,
});

const mapDispatchToProps = {
  unsetCurrentSurvey,
  setMainStage,
};

export default connect(mapStateToProps, mapDispatchToProps)(SurveyDetail);
