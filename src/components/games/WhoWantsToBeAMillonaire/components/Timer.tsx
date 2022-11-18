import { Progress } from 'antd';
import React, { useEffect, useState } from 'react';
import { TimerM } from '../interfaces/Millonaire';

const Timer = ({ countdown, timer }: TimerM) => {
  const [percent, setPercent] = useState(100);
  /* const [time, setTime] = useState(timer); */

  const decrease = () => {
    let newPercent = valueTime(countdown);
    setPercent(newPercent);
  };

  useEffect(() => {
    decrease();
  }, [countdown]);

  const valueTime = (countdown: number) => {
    let result = (countdown * 100) / timer;
    return result;
  };

  return (
    <Progress
      className={
        countdown <= 10 && countdown > 0 ? 'animate__animated animate__heartBeat animate__infinite animate__fast' : ''
      }
      status={countdown > 10 ? 'success' : 'exception'}
      trailColor='#120754'
      strokeLinecap='round'
      width={90}
      strokeColor={countdown > 10 ? '#52C41A' : '#FF4D4F'}
      type='circle'
      percent={percent}
      format={(percent) => `${countdown}s`}
    />
  );
};

export default Timer;

/*
const App: React.FC = () => {
  const [percent, setPercent] = useState(100);
  const [time, setTime] = useState(30);

  const decline = () => {
    let newPercent = valueTime(time);
    setTime(time - 1);
    setPercent(newPercent);
  };

  setTimeout(decline, 1000);

  const valueTime = (time) => {
    let result = (time * 100) / 30;
    return result;
  };

  return (
    <Progress
      strokeColor={time > 20 ? '#52C41A' : time > 10 ? '#128FE7' : '#FF4D4F'}
      type="circle"
      percent={percent}
      format={(percent) => `${time}s`}
    />
  );
};

export default App;
 */
