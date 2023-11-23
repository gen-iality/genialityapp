import { useEffect, useState } from 'react';
import { useInterval } from '@mantine/hooks';

export const useTimer = (seconds: number) => {
	const [timeRemaining, setTimeRemaining] = useState(seconds);
	const interval = useInterval(() => setTimeRemaining((s) => s - 1), 1000);

	useEffect(() => {
		interval.start();
		return interval.stop;
	}, []);

	return {
		timeRemaining,
        percentage: (timeRemaining / seconds) * 100,
	};
};
