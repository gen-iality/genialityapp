import React, { useState, useEffect } from 'react';
import { Row, Avatar, Divider, List, Skeleton } from 'antd';
import withContext from '../../../Context/withContext';

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

  const styleListPlayer = {
    background: 'white',
    color: '#333F44',
    padding: 5,
    margin: 4,
    display: 'flex',
    borderRadius: '5px',
    fontWeight: '500',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    height: '6vh',
  };

  return (
    <div style={{ marginTop: 16, width: '26vw' }}>
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
          renderItem={(item, key) => (
            <List.Item style={styleListPlayer} actions={[<a key='list-loadmore-edit'> {item.score} Puntos </a>]}>
              <Skeleton avatar title={false} loading={loading} active>
                <List.Item.Meta
                  avatar={<Avatar>{key + 1}</Avatar>}
                  title={
                    <a style={{ fontWeight: '500', fontSize: '14px' }} href='#'>
                      {formatName(item.name)}
                    </a>
                  }
                />
              </Skeleton>
            </List.Item>
          )}
        />
      </div>
    </div>
  );
}
export default withContext(RankingList);
