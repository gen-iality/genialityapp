import UsersCard from '@/components/shared/usersCard';
import { UseEventContext } from '@/context/eventContext';
import { ConfigProvider, Divider, Empty, List, Row, Typography } from 'antd';
import { useState } from 'react';
import { Score } from './types';

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
    <div>
      <Row justify='center'>
        <Typography.Title
          level={3}
          style={{
            color: `${styles && styles.textMenu}`,
          }}>
          Ranking
        </Typography.Title>
      </Row>
      <div className='container-dinamic-ranking' style={{ marginTop: 16, height: 'auto', overflowY: 'auto' }}>
        <ConfigProvider renderEmpty={() => <Empty description={'No hay participantes'} />}>
          <List
            className='demo-loadmore-list'
            loading={loading}
            itemLayout='horizontal'
            dataSource={scores}
            renderItem={(item, key) => <UsersCard type='ranking' item={item} isTime={type === 'time'} />}
          />
        </ConfigProvider>
      </div>
    </div>
  );
}
