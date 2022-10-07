import { useEffect } from 'react';
import { firestore } from '@helpers/firebase';
import RankingList from './rankingList';
import RankingMyScore from './rankingMyScore';
import { Divider } from 'antd';
import { UseSurveysContext } from '@context/surveysContext';
import { useCurrentUser } from '@context/userContext';
import { useHelper } from '@context/helperContext/hooks/useHelper';
import { useEventContext } from '@context/eventContext';

function RankingTrivia(props) {
  const { setGameRanking, setMyScore } = useHelper();
  let cSurveys = UseSurveysContext();
  let cUser = useCurrentUser();
  let eventContext = useEventContext();
  let currentSurvey = cSurveys.currentSurvey;
  let currentUser = cUser.value;
  let currentEvent = eventContext.value;

  // useEffect(() => {
  //   let unsubscribe;
  //   if (!currentSurvey) return;
  //   if (!(Object.keys(currentUser).length === 0)) {
  //     const initialValues = {
  //       name: currentUser.names ? currentUser.names : currentUser.name,
  //       score: 0,
  //     };

  //     unsubscribe = firestore
  //       .collection('surveys')
  //       .doc(currentSurvey._id)
  //       .collection('ranking')
  //       .doc(currentUser._id)
  //       .onSnapshot(function(result) {
  //         if (result.exists) {
  //           const data = result.data();
  //           setMyScore({ ...initialValues, score: data.correctAnswers });
  //         } else {
  //           setMyScore(initialValues);
  //         }
  //       });
  //   }
  //   return () => {
  //     unsubscribe();
  //     setMyScore({ name: '', score: 0 });
  //   };
  // }, [currentUser, currentSurvey]);

  useEffect(() => {
    let unsubscribe;
    if (!(Object.keys(currentUser).length === 0)) {
      if (!currentSurvey) return;
      unsubscribe = firestore
        .collection('surveys')
        .doc(currentSurvey._id)
        .collection('ranking')
        .orderBy('timeSpent', 'asc')
        // .limit(10)
        .onSnapshot(async (querySnapshot) => {
          var puntajes = [];
          puntajes = await Promise.all(
            querySnapshot.docs.map(async (doc, index) => {
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

          /** Puntaje de todos los participantes */
          // /** Ordenamos por puntaje */
          const orderScoresByScore = puntajes.sort(function(a, b) {
            return b.correctAnswers - a.correctAnswers;
          });

          // /** Agregamos la posición correspondiente */
          const positionScoresByScore = orderScoresByScore.map((item, index) => {
            return { ...item, index: index + 1 };
          });
          setGameRanking(positionScoresByScore.slice(0, 10));

          /** Puntaje individual */
          const cUserId = cUser.value?._id;
          const filterForRankingUserId = positionScoresByScore.filter(
            (rankingUsers) => rankingUsers.userId === cUserId
          );

          if (filterForRankingUserId?.length > 0) setMyScore(filterForRankingUserId);
        });
    }
    return () => {
      unsubscribe();
      setMyScore([{ name: '', score: 0 }]);
      setGameRanking([]);
    };
  }, [currentSurvey, currentUser]);

  const getDataUser = async (iduser) => {
    let user = await firestore
      .collection(`${currentEvent._id}_event_attendees`)
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
      {!(Object.keys(currentUser).length === 0) && (
        <>
          <RankingMyScore />
          <Divider />
          <RankingList />
        </>
      )}
    </>
  );
}

export default RankingTrivia;
