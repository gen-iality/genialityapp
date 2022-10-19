import { useState, useEffect } from 'react';
import { Row, Divider, List } from 'antd';
import withContext from '@context/withContext';
import UsersCard from '../../shared/usersCard';

function RankingList(props) {
  const { cEvent, cHelper } = props;
  const styles = cEvent.value.styles;
  const { myScore } = cHelper;

  const [loading, setloading] = useState(false);

  useEffect(() => {
    setloading(true);
    setloading(false);
  }, [myScore]);

  /** Se valida si el usuario ya participo, el name vacio es el estado inicial */
  const theUserAlreadyParticipated = myScore[0]?.name === '' ? true : false;

  return (
    <>
      {theUserAlreadyParticipated ? (
        <div className='card-games-ranking ranking-user'></div>
      ) : (
        <div style={{ marginTop: 16 }} className='card-games-ranking ranking-user'>
          <Row justify='center'>
            <h1
              style={{
                fontSize: '25px',
                fontWeight: 'bold',
                lineHeight: '3px',
                color: `${styles && styles.textMenu}`,
              }}>
              Mi puntaje
            </h1>
            <Divider style={{ backgroundColor: `${styles && styles.textMenu}` }} />
          </Row>
          <div className='container-ranking' style={{ marginTop: 16, height: 'auto', overflowY: 'auto' }}>
            <List
              className='demo-loadmore-list'
              loading={loading}
              itemLayout='horizontal'
              dataSource={myScore}
              renderItem={(item, key) => <UsersCard type='ranking' item={item} />}
            />
          </div>
        </div>
      )}
    </>
  );
}
export default withContext(RankingList);
