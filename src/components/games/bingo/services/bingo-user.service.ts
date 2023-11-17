/* import { BingoApi } from '@/helpers/request';
import { IResultPost } from '@/types';

export const assignCardToUser = async (userBingoId: string, bingoCartonId: string): Promise<IResultPost> => {
  try {
    const res = await BingoApi.algo(userBingoId, bingoCartonId);
    return {
      error: null,
    };
  } catch (error) {
    return {
      error,
    };
  }
};
 */