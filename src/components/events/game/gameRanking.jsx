import React, { useState, useEffect, useContext } from 'react';
import { firestore } from '../../../helpers/firebase';
import { Row, Col, Avatar } from 'antd';
import RankingList from '../../events/surveys/rankingList';
import WithEviusContext from '../../../Context/withContext';
import HelperContext from '../../../Context/HelperContext';

function GameRanking(props) {
   const [ranking, setRanking] = useState([]);
   const [myName, setMyName] = useState('');
   const [myScore, setMyScore] = useState('');
   let { setTheUserHasPlayed } = useContext(HelperContext);

   useEffect(() => {
      let gameId = props.cEvent?.openOtherGame ? 'oV0g5pRhLzSzWQNO8W63' : '0biWfCwWbUGhbZmfhkvu';

      //Consulta del puntaje del props.cEventUser.value
      if (!(Object.keys(props.cEventUser.value).length === 0)) {
         firestore
            .collection('juegos/' + gameId + '/puntajes/')
            .doc(props.cEventUser.value._id)
            .onSnapshot(function(response) {
               const myScore = response.data();
               console.log('myScore', myScore);
               if (myScore) {
                  setMyName(myScore.name);
                  setMyScore(myScore.puntaje);
               }
               if (myScore?.puntaje) {
                  setTheUserHasPlayed(true);
               } else {
                  setTheUserHasPlayed(false);
               }
            });
      }

      let order = '';
      if (props.cEvent.openOtherGame) {
         order = 'asc';
      } else {
         order = 'desc';
      }

      //Consulta de todos los puntajes
      firestore
         .collection('juegos/' + gameId + '/puntajes/')
         .orderBy('puntaje', order)
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
            setRanking(puntajes);
         });
   }, []);

   const getDataUser = async (iduser) => {
      let user = await firestore
         .collection(`${props.cEvent?.value?._id}_event_attendees`)
         .where('account_id', '==', iduser)
         .get();
      if (user.docs.length > 0 && props.cEvent.value.user_properties) {
         let fieldAvatar = props.cEvent.value.user_properties.filter((field) => field.type == 'avatar');
         if (fieldAvatar.length > 0) {
            return user.docs[0].data().user?.picture;
         }
      }
      return undefined;
   };

   return (
      <>
         {!(Object.keys(props.cEventUser.value).length === 0) && (
            <>
               {/*RANKING*/}
               <Row justify='center' style={{ backgroundColor: '#ffffff4d', padding: 5, borderRadius: '10px' }}>
                  <RankingList data={ranking} cEvent={props.cEvent.value} />
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
            {/* <h3 style={{ fontSize: '14px', fontWeight: '700', marginTop: '3px', color:props.cEvent.value.styles.textMenu }}>Mi Puntaje</h3> */}
            <div className='card-games-ranking ranking-user'>
               <Row justify='space-between'>
                  <Col span={6}>
                     <Avatar size={38}>
                        {myName && myName.charAt(0).toUpperCase()}
                        {myName && myName.substring(myName.indexOf(' ') + 1, myName.indexOf(' ') + 2)}
                     </Avatar>
                  </Col>
                  <Col span={12}>
                     <h3 style={{ fontWeight: '700', color: props.cEvent.value.styles.textMenu }}>
                        {props.cEventUser.value.properties.displayName}
                     </h3>
                  </Col>
                  <Col span={6}>
                     <h4 style={{ color: props.cEvent.value.styles.textMenu }}>{myScore} pts</h4>
                  </Col>
               </Row>
            </div>
         </>
      )}{' '}
   </>
);

export default WithEviusContext(GameRanking);
