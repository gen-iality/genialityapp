import React, { useState, useEffect } from 'react';
import { firestore } from '../../../helpers/firebase';
import { Row, Col, Avatar, Divider } from 'antd';
import RankingList from '../../events/surveys/rankingList';
import RankingMyScore from '../../events/surveys/rankingMyScore';

import WithEviusContext from '../../../Context/withContext';

function GameRanking(props) {
  const { cUser, cEvent, cHelper } = props;
  const currentUser = cUser.value;
  const currentEvent = cEvent.value;
  const { setGameRanking } = cHelper;
  const [myScore, setMyScore] = useState('');

  const styleRanking = {
    backgroundColor: `${currentEvent.styles.toolbarDefaultBg}`,
    padding: 5,
    borderRadius: '10px',
  };

  useEffect(() => {
    console.log('debug ');
    let gameId = '0biWfCwWbUGhbZmfhkvu';
    let unsubscribeCurrentUserScore;
    //Consulta del puntaje del currentUser
    if (!(Object.keys(currentUser).length === 0)) {
      unsubscribeCurrentUserScore = firestore
        .collection('juegos/' + gameId + '/puntajes/')
        .doc(currentUser._id)
        .onSnapshot(function(response) {
          const myScore = response.data();
          if (myScore) {
            let userScore = {
              ...myScore,
              score: myScore.puntaje,
            };
            setMyScore(userScore);
          }
        });
    }
    //Consulta de todos los puntajes
    let unsubscribeAllScores = firestore
      .collection('juegos/' + gameId + '/puntajes/')
      .orderBy('puntaje', 'desc')
      .limit(10)
      .onSnapshot(async (querySnapshot) => {
        var puntajes = [];
        puntajes = await Promise.all(
          querySnapshot.docs.map(async (doc) => {
            const result = doc.data();

            let picture = await getDataUser(result.eventUser_id);
            result['score'] = result.puntaje;
            result['imageProfile'] = picture;
            return result;
          })
        );
        setGameRanking(puntajes);
      });
    return () => {
      unsubscribeAllScores();
      unsubscribeCurrentUserScore();
      setMyScore('');
      setGameRanking([]);
    };
  }, [currentUser]);

  const getDataUser = async (iduser) => {
    let user = await firestore
      .collection(`${cEvent.value._id}_event_attendees`)
      .where('account_id', '==', iduser)
      .get();

    if (user.docs.length > 0 && user.docs[0].data()) {
      return user.docs[0].data().user?.picture;
    }
    return undefined;
  };
  return (
    <>
      {!(Object.keys(currentUser).length === 0) && (
        <>
          {/*RANKING*/}
          {/* <Row justify='center' style={styleRanking}> */}
          <RankingMyScore myScore={myScore} />
          <Divider />
          <RankingList />
          {/* </Row> */}
        </>
      )}
    </>
  );
}

export default WithEviusContext(GameRanking);
