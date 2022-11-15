import { Space, Button } from 'antd';
import Ranking from '../../common/Ranking';
import { useMillonaireLanding } from '../hooks/useMillonaireLanding';
export default function UsersRanking() {
  const { onChangeStatusGame, scoreUser, scores } = useMillonaireLanding();

  // ordernar los scores por time y score de forma descendente
  const scoresOrder = scores.sort((a, b) => {
    if (a.time < b.time) {
      return 1;
    }
    if (a.time > b.time) {
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

  return (
    <Space direction='vertical'>
      <Ranking withMyScore myScore={scoreUser} scores={scoresOrder} type={'points'} />

      <Button onClick={() => onChangeStatusGame('NOT_STARTED')}>Volver</Button>
    </Space>
  );
}
