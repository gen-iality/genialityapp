import React, { useState, useEffect } from 'react';
import { firestore } from '../../../helpers/firebase';
import RankingList from './RankingList';

export default function RankingTrivia({ currentSurvey }) {
  const [ranking, setRanking] = useState([]);

  useEffect(() => {
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
  }, [currentSurvey]);

  return <RankingList data={ranking} />;
}
