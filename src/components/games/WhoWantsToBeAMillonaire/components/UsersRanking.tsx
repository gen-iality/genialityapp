import { Space, Button } from 'antd';
import Ranking from '../../common/Ranking';
import { useMillonaireLanding } from '../hooks/useMillonaireLanding';
export default function UsersRanking() {
  const { onChangeStatusGame, scoreUser, scores } = useMillonaireLanding();

  // ordernar los scores por time y score de forma descendente
  const scoresOrder = scores.sort((a, b) => {
    if (new Date(a.time.seconds * 1000) < new Date(b.time.seconds * 1000)) {
      return 1;
    }
    if (new Date(a.time.seconds * 1000) < new Date(b.time.seconds * 1000)) {
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
    <Space direction='vertical'>
      <Ranking
        withMyScore
        myScore={Object.entries(scoreUser).length > 0 ? scoreUserNew : undefined}
        scores={newScores}
        type={'points'}
      />

      <Button onClick={() => onChangeStatusGame('NOT_STARTED')}>Volver</Button>
    </Space>
  );
}
