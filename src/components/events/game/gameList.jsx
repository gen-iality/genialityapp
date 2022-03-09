import React, { useState, useEffect } from 'react';
import { List, Result, Card } from 'antd';
import GoogleControllerOff from '@2fd/ant-design-icons/lib/GoogleControllerOff';
import UsersCard from '../../shared/usersCard';
import withContext from '../../../context/withContext';

const bodyStyle = { borderBottomLeftRadius: '10px', borderBottomRightRadius: '10px' };

function GameList(props) {
  const { cHelper } = props;
  const gamesData = cHelper.currentActivity.avalibleGames;
  const [listOfGames, setListOfGames] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  function getGamesData() {
    let games = gamesData ? gamesData : [];
    const gamesDataFiltered = games.filter((games) => games.showGame === true);
    setListOfGames(gamesDataFiltered);
    setIsLoading(false);
  }

  useEffect(() => {
    getGamesData();
  }, [gamesData]);

  return (
    <Card style={{ borderRadius: '10px', marginTop: '6px' }} bodyStyle={bodyStyle}>
      {/* <div
        className='container-ranking'
        style={{ marginTop: 16, height: 'auto', overflowY: 'auto', overflowX: 'hidden' }}> */}
      <List
        loading={isLoading}
        itemLayout='horizontal'
        dataSource={listOfGames}
        renderItem={(item) => (
          <Card
            className='card-agenda-desktop agendaHover efect-scale'
            style={{
              borderRadius: '10px',
              marginBottom: '8px',
              border: '1px solid',
              borderColor: '#0000001c',
            }}>
            <UsersCard type='gameList' item={item} />
          </Card>
        )}
        locale={{
          emptyText: <Result icon={<GoogleControllerOff />} title='No hay juegos disponibles para esta actividad' />,
        }}
      />
      {/* </div> */}
    </Card>
  );
}

export default withContext(GameList);
