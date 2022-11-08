import { Score } from '../../common/Ranking/RankingMyScore';
import { Player } from '../types';
import { parseTime } from './parseTime';

export const fromPlayerToScore = (player: Player, index: number): Score => {
	return {
		imageProfile: player.picture,
		index,
		name: player.user_name,
		score: parseTime(player.duration),
		isFinish: player.isFinish,
		uid: player.event_user_id,
	};
};
