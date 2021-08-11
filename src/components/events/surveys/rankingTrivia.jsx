import React, { useState, useEffect } from 'react';
import { firestore } from '../../../helpers/firebase';
import RankingList from './rankingList';
import RankingMyScore from './rankingMyScore';
import { connect } from 'react-redux';

function RankingTrivia(props) {
  const [ranking, setRanking] = useState([]);
  const [myScore, setMyScore] = useState({ name: '', score: 0 });

  const { currentSurvey, currentUser } = props;
  useEffect(() => {
    console.log('RANKING');
    console.log(currentSurvey);
    if (!currentSurvey) return;
    if (!(Object.keys(currentUser).length === 0)) {
      const initialValues = {
        name: currentUser.names ? currentUser.names : currentUser.name,
        score: 0,
      };

      firestore
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
  }, [currentUser, currentSurvey]);

  useEffect(() => {
    if (!(Object.keys(currentUser).length === 0)) {
      if (!currentSurvey) return;
      firestore
        .collection('surveys')
        .doc(currentSurvey._id)
        .collection('ranking')
        .onSnapshot(function(result) {
          if (result) {
            const players = [];
            const data = result.docs;
            data.forEach((player) => {
              const result = player.data();
              players.push({
                name: result.userName,
                score: result.correctAnswers,
              });
            });

            players.sort(function(a, b) {
              return b.score - a.score;
            });

            setRanking(players);
          }
        });
    }
  }, [currentSurvey, currentUser]);

  return (
    <>
      {!(Object.keys(currentUser).length === 0) && (
        <>
          <RankingMyScore myScore={myScore} />
          <RankingList data={ranking} />
        </>
      )}
    </>
  );
}

const mapStateToProps = (state) => ({
  currentUser: state.user.data,
  currentSurvey: state.survey.data.currentSurvey,
});

export default connect(mapStateToProps)(RankingTrivia);
