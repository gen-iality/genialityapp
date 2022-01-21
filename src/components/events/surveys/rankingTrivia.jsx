import React, { useState, useEffect, useContext } from 'react';
import { firestore } from '../../../helpers/firebase';
import RankingList from './rankingList';
import RankingMyScore from './rankingMyScore';
import { Divider } from 'antd';
import { UseSurveysContext } from '../../../Context/surveysContext';
import { UseCurrentUser } from '../../../Context/userContext';
import { HelperContext } from '../../../Context/HelperContext';
import { UseEventContext } from '../../../Context/eventContext';

function RankingTrivia(props) {
  const { setGameRanking } = useContext(HelperContext);
  let cSurveys = UseSurveysContext();
  let cUser = UseCurrentUser();
  let eventContext = UseEventContext();
  let currentSurvey = cSurveys.currentSurvey;
  let currentUser = cUser.value;
  let currentEvent = eventContext.value;

  const [myScore, setMyScore] = useState({ name: '', score: 0 });

  useEffect(() => {
    let unsubscribe;
    if (!currentSurvey) return;
    if (!(Object.keys(currentUser).length === 0)) {
      const initialValues = {
        name: currentUser.names ? currentUser.names : currentUser.name,
        score: 0,
      };

      unsubscribe = firestore
        .collection('surveys')
        .doc(currentSurvey._id)
        .collection('ranking')
        .doc(currentUser._id)
        .onSnapshot(function(result) {
          if (result.exists) {
            const data = result.data();
            setMyScore({ ...initialValues, score: data.correctAnswers });
          } else {
            setMyScore(initialValues);
          }
        });
    }
    return () => {
      unsubscribe();
      setMyScore({ name: '', score: 0 });
    };
  }, [currentUser, currentSurvey]);

  useEffect(() => {
    let unsubscribe;
    if (!(Object.keys(currentUser).length === 0)) {
      if (!currentSurvey) return;
      unsubscribe = firestore
        .collection('surveys')
        .doc(currentSurvey._id)
        .collection('ranking')
        .orderBy('correctAnswers', 'desc')
        .limit(10)
        .onSnapshot(async (querySnapshot) => {
          var puntajes = [];
          puntajes = await Promise.all(
            querySnapshot.docs.map(async (doc) => {
              const result = doc.data();
              let picture;
              if (result?.userId) {
                picture = await getDataUser(result?.userId);
              }
              result['score'] = result.correctAnswers;
              result['name'] = result.userName;
              result['imageProfile'] = picture;
              return result;
            })
          );

          setGameRanking(puntajes);
        });
    }
    return () => {
      unsubscribe();
      setGameRanking([]);
    };
  }, [currentSurvey, currentUser]);

  const getDataUser = async (iduser) => {
    let user = await firestore
      .collection(`${currentEvent._id}_event_attendees`)
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
          <RankingMyScore myScore={myScore} />
          <Divider />
          <RankingList />
        </>
      )}
    </>
  );
}

export default RankingTrivia;
