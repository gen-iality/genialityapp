import { Typography } from 'antd';
import { useEffect, useState } from 'react';
import useWhereIsInLanding from '../../hooks/useWhereIsInLanding';

export default function Timer() {
	const { location } = useWhereIsInLanding();
	const [counter, setCounter] = useState(0);

	// // Uncomment in production
	// useEffect(() => {
	// 	if (location.activeView === 'game') {
	// 		setTimeout(() => {
	// 			setCounter(prev => prev + 1);
	// 		}, 1000);
	// 	}
	// }, [location.activeView, counter]);

	if (location.activeView !== 'game') return null;

	return <Typography style={{ fontSize: '20px' }}>{counter}</Typography>;
}
