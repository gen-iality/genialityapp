import UsersCard from '@/components/shared/usersCard';
import { UseEventContext } from '@/context/eventContext';
import { Divider, List, Row, Typography } from 'antd';
import { useState } from 'react';
import { Score } from './types';

interface Props {
  myScore: Score;
  type: 'time' | 'points';
}

export default function RankingMyScore(props: Props) {
  const { myScore, type } = props;
  const cEvent = UseEventContext();
  const { styles } = cEvent;
  const [loading, setloading] = useState(false);

  return (
    <>
      <div className='card-dinamic-ranking ranking-user'>
        <Row justify='center'>
          <Typography.Title
            level={3}
            style={{
              color: `${styles && styles.textMenu}`,
            }}>
            Mi Puntaje
          </Typography.Title>
          <Divider style={{ backgroundColor: `${styles && styles.textMenu}` }} />
        </Row>
        <div className='container-dinamic-ranking' style={{ marginTop: 16, height: 'auto', overflowY: 'auto' }}>
          <List
            className='demo-loadmore-list'
            loading={loading}
            itemLayout='horizontal'
            dataSource={[myScore]}
            renderItem={(item, key) => <UsersCard type='ranking' item={item} isTime={type === 'time'} />}
          />
        </div>
      </div>
    </>
  );
}
