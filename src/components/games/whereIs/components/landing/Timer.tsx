import { Typography } from 'antd';
import { useEffect, useState } from 'react';
import useWhereIsInLanding from '../../hooks/useWhereIsInLanding';

export default function Timer() {
  const { location, setTimer, whereIsGame } = useWhereIsInLanding();
  // const [counter, setCounter] = useState(0);

  //add minutes and seconds
  const miliseconds = whereIsGame.duration * 1000;
  const minutes = String(Math.floor(whereIsGame.duration / 60)).padStart(2);
  const seconds = String(whereIsGame.duration - +minutes * 60).padStart(2, 0);

  // // Uncomment in production
  useEffect(() => {
    if (location.activeView === 'game' && !whereIsGame.isFinish) {
      setTimeout(() => {
        setTimer(whereIsGame.duration + 1);
      }, 1000);
    }
  }, [location.activeView, whereIsGame.duration, whereIsGame.isFinish]);

  // useEffect(() => {
  // 	// return () => {
  // 	if (whereIsGame.won) {
  // 		console.log(counter);
  // 		setTimer(counter);
  // 	}
  // 	// };
  // }, [location.activeView, whereIsGame.won]);

  if (location.activeView !== 'game') return null;

  return <Typography style={{ fontSize: '20px' }}>{`${minutes} : ${seconds}`}</Typography>;
}
