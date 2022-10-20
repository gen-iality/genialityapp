import { useState, useEffect } from 'react';
import { firestore } from '@helpers/firebase';
import { Row, Col, Avatar, Divider } from 'antd';
import RankingList from '../../events/surveys/rankingList';
import RankingMyScore from '../../events/surveys/rankingMyScore';

import WithEviusContext from '@context/withContext';

function GameRanking(props) {
  const { cUser, cEvent, cHelper } = props;
  const currentUser = cUser.value;
  const currentEvent = cEvent.value;
  const { setGameRanking, setMyScore } = cHelper;

  const styleRanking = {
    backgroundColor: `${currentEvent.styles.toolbarDefaultBg}`,
    padding: 5,
    borderRadius: '10px',
  };

  useEffect(() => {
    const gameId = '0biWfCwWbUGhbZmfhkvu';
    // let unsubscribeCurrentUserScore;
    // //Consulta del puntaje del currentUser
    // if (!(Object.keys(currentUser).length === 0)) {
    //   unsubscribeCurrentUserScore = firestore
    //     .collection('juegos/' + gameId + '/puntajes/')
    //     .doc(currentUser._id)
    //     .onSnapshot(function(response) {
    //       const myScore = response.data();
    //       if (myScore) {
    //         let userScore = {
    //           ...myScore,
    //           score: myScore.puntaje,
    //         };
    //         setMyScore(userScore);
    //       }
    //     });
    // }
    //Consulta de todos los puntajes
    const unsubscribeAllScores = firestore
      .collection('juegos/' + gameId + '/puntajes/')
      .orderBy('puntaje', 'desc')
      // .limit(10)
      .onSnapshot(async (querySnapshot) => {
        const puntajes = [];
        puntajes = await Promise.all(
          querySnapshot.docs.map(async (doc, index) => {
            const result = doc.data();

            const picture = await getDataUser(result.eventUser_id);
            result['score'] = result.puntaje;
            result['imageProfile'] = picture;
            result['index'] = index + 1;
            return result;
          })
        );
        const cUserId = currentUser?._id;
        const filterForRankingUserId = puntajes.filter((rankingUsers) => rankingUsers.eventUser_id === cUserId);

        /** Puntaje individual */
        if (filterForRankingUserId?.length > 0) setMyScore(filterForRankingUserId);

        /** Puntaje de todos los participantes */
        setGameRanking(puntajes.slice(0, 10));
      });
    return () => {
      unsubscribeAllScores();
      // unsubscribeCurrentUserScore();
      setMyScore([{ name: '', score: 0 }]);
      setGameRanking([]);
    };
  }, [currentUser]);

  const getDataUser = async (iduser) => {
    const user = await firestore
      .collection(`${cEvent.value._id}_event_attendees`)
      .where('account_id', '==', iduser)
      .get();

    if (user.docs.length > 0 && user.docs[0].data()) {
      const userPicture = user.docs[0].data().user?.picture;
      /** Se filtra para las imagenes que llegan con esta ruta './scripts/img/' en cambio de una Url  https://*/
      const userPictureFiltered = userPicture?.includes('./scripts/img/') ? null : userPicture;
      return userPictureFiltered;
    }
    return undefined;
  };
  return (
    <>
      {/*RANKING*/}
      <RankingMyScore />
      <Divider />
      <RankingList />
    </>
  );
}

export default WithEviusContext(GameRanking);
