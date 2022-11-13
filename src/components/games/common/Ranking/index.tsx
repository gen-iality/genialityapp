import { Divider } from 'antd';
import RankingMyScore from './RankingMyScore';
import RankingList from './RankingList';
import { Score } from './types';

interface Props {
	myScore?: Score;
	scores: Score[];
	type: 'time' | 'points';
	withMyScore?: boolean;
}

export default function Ranking(props: Props) {
	const { myScore, scores, type, withMyScore } = props;
	return (
		<>
			{!!withMyScore && myScore && (
				<>
					<RankingMyScore myScore={myScore} type={type} />
					<Divider />
				</>
			)}
			<RankingList scores={scores} type={type} />
		</>
	);
}
