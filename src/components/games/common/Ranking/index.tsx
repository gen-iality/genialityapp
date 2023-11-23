import { Divider } from 'antd';
import RankingMyScore from './RankingMyScore';
import RankingList from './RankingList';
import { Score } from './types';

interface Props {
	myScore?: Score;
	scores: Score[];
	type: 'time' | 'points';
	withMyScore?: boolean;
	currentColor?: string;
}

export default function Ranking(props: Props) {
	const { myScore, scores, type, withMyScore, currentColor  } = props;
	return (
		<>
			{!!withMyScore && myScore && (
				<>
					<RankingMyScore myScore={myScore} type={type} currentColor={currentColor} />
					<Divider />
				</>
			)}
			<RankingList scores={scores} type={type} currentColor={currentColor} />
		</>
	);
}
