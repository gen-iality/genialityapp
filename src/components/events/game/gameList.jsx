import React, { useState, useEffect } from 'react';
import { firestore } from '../../../helpers/firebase';
import { Row, Divider, List } from 'antd';
import UsersCard from '../../shared/usersCard';
import withContext from '../../../Context/withContext';

function GameList(props) {
  const { cEvent, cHelper } = props;
  const currentEvent = cEvent.value;
  const gamesData = cHelper.currentActivity.avalibleGames;
  const [listOfGames, setListOfGames] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  function getGamesData() {
    const gamesDataFiltered = gamesData.filter((games) => games.showGame === true);
    setListOfGames(gamesDataFiltered);
    setIsLoading(false);
  }

  useEffect(() => {
    getGamesData();
  }, [gamesData]);

  return (
    <div style={{ marginTop: 16 }}>
      <Row justify='center'>
        <h1
          style={{ fontSize: '25px', fontWeight: 'bold', lineHeight: '3px', color: `${currentEvent.styles.textMenu}` }}>
          Lista de juegos
        </h1>
        <Divider style={{ backgroundColor: `${currentEvent.styles.textMenu}` }} />
      </Row>
      <div
        className='container-ranking'
        style={{ marginTop: 16, height: 'auto', overflowY: 'auto', overflowX: 'hidden' }}>
        <List
          loading={isLoading}
          itemLayout='horizontal'
          dataSource={listOfGames}
          renderItem={(item) => <UsersCard type='gameList' item={item} />}
        />
      </div>
    </div>
  );
}

export default withContext(GameList);
