import { Divider } from 'antd';
import { useEffect, useState } from 'react';
import useWhereIsInLanding from '../../whereIs/hooks/useWhereIsInLanding';
import RankingList from './RankingList';
import RankingMyScore, { Score } from './RankingMyScore';

export default function Ranking() {
	const [scores, setScores] = useState<Score[]>([]);
	const [myScore, setMyScore] = useState<Score>({} as Score);
	const { getPlayer, getScores } = useWhereIsInLanding();

	useEffect(() => {
		// getPlayer();
		getScores();
	}, []);
	// const scores = [
	// 	{
	// 		name: 'Juan',
	// 		uid: '634878c188e8904f40664aa3',
	// 		imageProfile:
	// 			'https://firebasestorage.googleapis.com/v0/b/eviusauthdev.appspot.com/o/images%2F1664828271521.png?alt=media&token=dae70e80-45ea-4daa-9523-ed9bd0ffdf67',
	// 		index: 1,
	// 		score: '00:03',
	// 	},
	// 	{
	// 		name: 'Juan',
	// 		uid: '634878c188e8904f40664aa3',
	// 		imageProfile:
	// 			'https://firebasestorage.googleapis.com/v0/b/eviusauthdev.appspot.com/o/images%2F1664828271521.png?alt=media&token=dae70e80-45ea-4daa-9523-ed9bd0ffdf67',
	// 		index: 2,
	// 		score: '00:30',
	// 	},
	// 	{
	// 		name: 'Juan',
	// 		uid: '634878c188e8904f40664aa3',
	// 		imageProfile:
	// 			'https://firebasestorage.googleapis.com/v0/b/eviusauthdev.appspot.com/o/images%2F1664828271521.png?alt=media&token=dae70e80-45ea-4daa-9523-ed9bd0ffdf67',
	// 		index: 3,
	// 		score: '03:00',
	// 	},
	// {
	// 	name: 'Juan',
	// 	uid: '634878c188e8904f40664aa3',
	// 	imageProfile:
	// 		'https://firebasestorage.googleapis.com/v0/b/eviusauthdev.appspot.com/o/images%2F1664828271521.png?alt=media&token=dae70e80-45ea-4daa-9523-ed9bd0ffdf67',
	// 	index: 4,
	// 	score: '10:00',
	// },
	// ];
	return (
		<>
			{myScore.uid && <RankingMyScore myScore={scores[0]} type='time' />}
			<Divider />
			{!!scores.length && <RankingList scores={scores} type='time' />}
		</>
	);
}
