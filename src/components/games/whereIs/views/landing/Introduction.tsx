import { Button } from 'antd';
import useWhereIsInLanding from '../../hooks/useWhereIsInLanding';

export default function Introduction() {
	const { goTo } = useWhereIsInLanding();
	const handleStart = () => {
		goTo('game');
	};
	return (
		<div>
			This is Introduction view
			<Button onClick={handleStart}>Start the game</Button>
		</div>
	);
}
