import Ranking from '@/components/games/common/Ranking';
import { Button, Card, Col, Row } from 'antd';
import useWhereIs from '../../hooks/useWhereIs';
import { WhereIs } from '../../types';
import { useState } from 'react';

interface Props {
  whereIs: WhereIs;
}

export default function TabResults(props: Props) {
  const { scores, restoreScores } = useWhereIs();
  const [isRestoring, setIsRestoring] = useState(false);
  const onRestoreScore = async () => {
    setIsRestoring(true);
    await restoreScores();
    setIsRestoring(false);
  };
  return (
    <Row gutter={[12, 12]}>
      <Col>
        <Button onClick={onRestoreScore} loading={isRestoring}>
          Reiniciar Rancking
        </Button>
      </Col>
      <Col xs={24} style={{ display: 'flex', justifyContent: 'center' }}>
        <Card style={{ width: '100%', maxWidth: '600px' }}>
          <Ranking scores={scores} type='points' />
        </Card>
      </Col>
    </Row>
  );
}
