import { Typography } from 'antd';
import { useEffect, useState } from 'react';
import useWhereIsInLanding from '../../hooks/useWhereIsInLanding';
import { parseTime } from '../../utils/parseTime';

export default function Timer() {
	const { location, setTimer, whereIsGame } = useWhereIsInLanding();
	// const [counter, setCounter] = useState(0);
	console.log('whereIsGame en timer',whereIsGame)
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

	return <Typography style={{ fontSize: '20px' }}>{parseTime(whereIsGame.duration)}</Typography>;
}
