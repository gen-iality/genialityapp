import { Score } from '../../common/Ranking/types';
import { Post } from '../types';

export const findScoreAndUpdate = (scores: Score[], scoreId: Post['id'], newScore: number) => {
	const scoreToUpdate = scores.find(score => score.uid === scoreId);
	if (!scoreToUpdate) return scores;
	const scoreRest = scores.filter(score => score.uid !== scoreId);
	const newScoreToUpdate = { ...scoreToUpdate, score: `${newScore}` };
	return [...scoreRest, newScoreToUpdate]
		.sort((a: Score, b: Score) => Number(b.score) === Number(a.score) ? 
			new Date(a.created_at).getTime() - new Date(b.created_at).getTime() 
			: 
			Number(b.score) - Number(a.score))
		.map((score, index) => ({ ...score, index: index + 1 }));
};
