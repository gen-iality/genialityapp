import { Space, Button, Row, Col, Card, Grid } from 'antd';
import Ranking from '../../common/Ranking';
import { useMillonaireLanding } from '../hooks/useMillonaireLanding';
const { useBreakpoint } = Grid;
export default function UsersRanking() {
  const { onChangeStatusGame, scoreUser, scores } = useMillonaireLanding();
  const screens = useBreakpoint();

  // ordernar los scores por time y score de forma descendente
  const scoresOrder = scores.sort((a, b) => {
    if (new Date(a.time?.seconds * 1000) < new Date(b.time?.seconds * 1000)) {
      return 1;
    }
    if (new Date(a.time?.seconds * 1000) < new Date(b.time?.seconds * 1000)) {
      return -1;
    }
    if (a.score < b.score) {
      return 1;
    }
    if (a.score > b.score) {
      return -1;
    }
    return 0;
  });
  const newScores = scoresOrder.map((score, index) => {
    return {
      ...score,
      index: index + 1,
    };
  });

  const scoreUserNew = newScores.find((score) => score.uid === scoreUser.uid);

  return (
    <Row
      align='middle'
      justify='center'
      style={{
        height: '100%',
      }}>
      <Card
        headStyle={{ border: 'none' }}
        extra={
          <Button size='large' onClick={() => onChangeStatusGame('NOT_STARTED')}>
            Volver al inicio
          </Button>
        }
        style={{
          border: 'none',
          backgroundColor: '#FFFFFFCC',
          backdropFilter: 'blur(8px)',
          width: screens.xs ? '95vw' : '40vw',
          height: '90vh',
        }}
        bodyStyle={{ height: '85%', overflowY: 'auto' }}>
        <Ranking
          withMyScore
          myScore={Object.entries(scoreUser).length > 0 ? scoreUserNew : undefined}
          scores={newScores}
          type={'points'}
        />
      </Card>
    </Row>
  );
}
