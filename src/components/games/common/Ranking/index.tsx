import { Divider } from 'antd';
import RankingList from './RankingList';
import RankingMyScore from './RankingMyScore';

export default function Ranking() {
	return (
		<>
			<RankingMyScore />
			<Divider />
			<RankingList />
		</>
	);
}
