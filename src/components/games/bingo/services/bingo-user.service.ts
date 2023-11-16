import { BingoApi } from '@/helpers/request';
import { IResultPost } from '@/types';

export const assignCardToUser = async (userBingoId: string, bingoCartonId: string): Promise<IResultPost> => {
  try {
    const res = await BingoApi.algo(userBingoId, bingoCartonId);
    return {
      ok: true,
    };
  } catch (error) {
    return {
      ok: false,
    };
  }
};
