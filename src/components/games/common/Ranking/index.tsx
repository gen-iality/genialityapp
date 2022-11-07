import { UseUserEvent } from '@/context/eventUserContext';
import { Divider } from 'antd';
import { useEffect, useState } from 'react';
import useWhereIsInLanding from '../../whereIs/hooks/useWhereIsInLanding';
import RankingList from './RankingList';
import RankingMyScore, { Score } from './RankingMyScore';

export default function Ranking() {
  const cUser = UseUserEvent();
  const [scores, setScores] = useState<Score[]>([]);
  const [myScore, setMyScore] = useState<Score>({} as Score);
  const { getPlayer, getScores, player } = useWhereIsInLanding();

  useEffect(() => {
    getScores().then(({ scoresFinished, scoresNotFinished }) => {
      // const myIndexScore = scores.findIndex(score => score.uid === cUser.value._id);
      const myScoreWin = scoresFinished.find((score) => score.uid === (cUser.value._id as string));
      const myScoreLose = scoresNotFinished.find((score) => score.uid === (cUser.value._id as string));
      if (myScoreWin) {
        setMyScore(myScoreWin);
      }
      if (myScoreLose) {
        setMyScore(myScoreLose);
      }
      // const scoresFinished = scoresFinished.filter(score => score.isFinish === true);
      setScores(scoresFinished);
    });
  }, []);
  return (
    <div style={{ height: '80vh', overflowY: 'auto' }}>
      {myScore.uid && <RankingMyScore myScore={myScore} type='time' />}
      {/* {!myScore.isFinish && <p>Lo sentimos, perdiste</p>} */}
      <Divider />
      {!!scores.length && <RankingList scores={scores} type='time' />}
    </div>
  );
}
