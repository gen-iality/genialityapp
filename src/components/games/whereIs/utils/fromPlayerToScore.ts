import { IScoreParsed } from '../../common/Ranking/types';
import { Player } from '../types';
import { parseTime } from './parseTime';


export const fromPlayerToScore = (player: Player, index: number): IScoreParsed => {
  return {
    imageProfile: player.picture,
    index,
    name: player.user_name,
    score: parseTime(player.duration),
    isFinish: player.isFinish,
    uid: player.event_user_id,
  };
};
