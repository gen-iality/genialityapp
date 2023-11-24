import { Progress, Typography } from 'antd';
import React, { useEffect, useState } from 'react';
import { TimerM } from '../interfaces/Millonaire';
import { useMillonaireLanding } from '../hooks/useMillonaireLanding';

const Timer = ({ countdown, timer }: TimerM) => {
	const { millonaire } = useMillonaireLanding();
	const [percent, setPercent] = useState(100);
	/* const [time, setTime] = useState(timer); */
	const backgroundMillonaire = millonaire.appearance.background_color || '#120754';
	const primaryMillonaire = millonaire.appearance.primary_color || '#FFB500';

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
			trailColor={backgroundMillonaire}
			strokeLinecap='round'
			width={90}
			strokeColor={primaryMillonaire}
			type='circle'
			percent={percent}
			format={(percent) => <Typography.Text style={{ color: primaryMillonaire }}>{`${countdown}s`}</Typography.Text>}
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
