import UsersCard from '@/components/shared/usersCard';
import { UseEventContext } from '@/context/eventContext';
import { Divider, List, Row } from 'antd';
import { useState } from 'react';
import { Score } from './RankingMyScore';

interface Props {
  scores: Score[];
  type: 'time' | 'points';
}

export default function RankingList(props: Props) {
  const { scores, type } = props;
  const cEvent = UseEventContext();
  const [loading, setLoading] = useState(false);
  const styles = cEvent.value.styles;

  return (
    <div style={{ marginTop: 16 }}>
      <Row justify='center'>
        <h1
          style={{
            fontSize: '25px',
            fontWeight: 'bold',
            lineHeight: '3px',
            color: `${styles && styles.textMenu}`,
          }}>
          Ranking
        </h1>
        <Divider style={{ backgroundColor: `${styles && styles.textMenu}` }} />
      </Row>
      <div className='container-dinamic-ranking' style={{ marginTop: 16, height: 'auto', overflowY: 'auto' }}>
        <List
          className='demo-loadmore-list'
          loading={loading}
          itemLayout='horizontal'
          dataSource={scores}
          renderItem={(item, key) => <UsersCard type='ranking' item={item} isTime={type === 'time'} />}
        />
      </div>
    </div>
  );
}
