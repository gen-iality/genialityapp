import React, { useState, useEffect } from 'react';
import { firestore } from '../../../helpers/firebase';
import { Row, Col, Avatar } from 'antd';
import RankingList from '../../events/surveys/rankingList';
import WithEviusContext from '../../../Context/withContext';

function GameRanking(props) {
  const { cUser, cEvent, cHelper } = props;
  const currentUser = cUser.value;
  const currentEvent = cEvent.value;
  const { setGameRanking } = cHelper;
  const [myName, setMyName] = useState('');
  const [myScore, setMyScore] = useState('');

  const styleRanking = {
    backgroundColor: `${currentEvent.styles.toolbarDefaultBg}`,
    padding: 5,
    borderRadius: '10px',
  };

  useEffect(() => {
    let gameId = '0biWfCwWbUGhbZmfhkvu';

    //Consulta del puntaje del currentUser
    if (!(Object.keys(currentUser).length === 0)) {
      firestore
        .collection('juegos/' + gameId + '/puntajes/')
        .doc(currentUser._id)
        .onSnapshot(function(response) {
          const myScore = response.data();

          if (myScore) {
            setMyName(myScore.name);
            setMyScore(myScore.puntaje);
          }
        });
    }
    //Consulta de todos los puntajes
    firestore
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
  }, [currentUser]);

  const getDataUser = async (iduser) => {
    let user = await firestore
      .collection(`${cEvent.value._id}_event_attendees`)
      .where('account_id', '==', iduser)
      .get();
    if (user.docs.length > 0 && cEvent.value.user_properties) {
      let fieldAvatar = cEvent.value.user_properties.filter((field) => field.type == 'avatar');
      if (fieldAvatar.length > 0) {
        return user.docs[0].data().user?.picture;
      }
    }
    return undefined;
  };
  return (
    <>
      {!(Object.keys(currentUser).length === 0) && (
        <>
          {/*RANKING*/}
          <Row justify='center' style={styleRanking}>
            <RankingList />
          </Row>
        </>
      )}
    </>
  );
}

const RenderMeScore = ({ myName, myScore }) => (
  <>
    {myName !== '' && myScore !== '' && (
      <>
        {/* <h3 style={{ fontSize: '14px', fontWeight: '700', marginTop: '3px', color:cEvent.styles.textMenu }}>Mi Puntaje</h3> */}
        <div className='card-games-ranking ranking-user'>
          <Row justify='space-between'>
            <Col span={6}>
              <Avatar size={38}>
                {myName && myName.charAt(0).toUpperCase()}
                {myName && myName.substring(myName.indexOf(' ') + 1, myName.indexOf(' ') + 2)}
              </Avatar>
            </Col>
            <Col span={12}>
              <h3 style={{ fontWeight: '700', color: currentEvent.styles.textMenu }}>{currentUser.displayName}</h3>
            </Col>
            <Col span={6}>
              <h4 style={{ color: cEvent.styles.textMenu }}>{myScore} pts</h4>
            </Col>
          </Row>
        </div>
      </>
    )}{' '}
  </>
);

export default WithEviusContext(GameRanking);
