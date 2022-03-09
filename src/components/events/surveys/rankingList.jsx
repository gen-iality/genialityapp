import React, { useState, useEffect } from 'react';
import { Row, Divider, List } from 'antd';
import withContext from '../../../context/withContext';
import UsersCard from '../../shared/usersCard';

function RankingList(props) {
  const { cEvent, cHelper } = props;
  const styles = cEvent.value.styles;
  const { gameRanking } = cHelper;
  function formatName(name) {
    const result = decodeURIComponent(name);
    return result;
  }

  const [loading, setloading] = useState(false);

  useEffect(() => {
    setloading(true);
    setloading(false);
  }, [gameRanking]);

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
      <div className='container-ranking' style={{ marginTop: 16, height: 'auto', overflowY: 'auto' }}>
        <List
          className='demo-loadmore-list'
          loading={loading}
          itemLayout='horizontal'
          dataSource={gameRanking}
          renderItem={(item, key) => <UsersCard type='ranking' item={item} />}
        />
      </div>
    </div>
  );
}
export default withContext(RankingList);
