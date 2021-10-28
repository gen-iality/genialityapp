import React, { useState, useEffect } from 'react';
import { firestore } from '../../../helpers/firebase';
import { Row, Divider, List } from 'antd';
import UsersCard from '../../shared/usersCard';
import { connect } from 'react-redux';

function GameList(props) {
  const { cEvent } = props;
  const [listOfGames, setListOfGames] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  function getGamesData() {
    const docRef = firestore.collection('gamesAvailable');
    const unSuscribe = docRef.where('showGame', '==', true).onSnapshot((querySnapshot) => {
      let gamesData = [];
      querySnapshot.forEach((doc) => {
        gamesData.push({ ...doc.data(), id: doc.id });
      });
      setListOfGames(gamesData);
      setIsLoading(false);
    });
    return unSuscribe;
  }

  useEffect(() => {
    const unSuscribe = getGamesData();

    return () => unSuscribe();
  }, []);

  return (
    <div style={{ marginTop: 16 }}>
      <Row justify='center'>
        <h1 style={{ fontSize: '25px', fontWeight: 'bold', lineHeight: '3px', color: `${cEvent.styles.textMenu}` }}>
          Lista de juegos
        </h1>
        <Divider style={{ backgroundColor: `${cEvent.styles.textMenu}` }} />
      </Row>
      <div className='container-ranking' style={{ marginTop: 16, height: 'auto', overflowY: 'auto' }}>
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

const mapStateToProps = (state) => ({
  currentUser: state.user.data,
});

export default connect(mapStateToProps)(GameList);
