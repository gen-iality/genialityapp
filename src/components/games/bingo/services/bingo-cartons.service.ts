import { IOptionsError, IOptionsSucces, IResultDelete, IResultPost, TErrorsService, TSuccesService } from '@/types';
import { BingoCarton } from '../interfaces/bingo';
import privateInstance, { BingoApi } from '@/helpers/request';
import { DispatchMessageService } from '@/context/MessageService';
import { GetTokenUserFirebase } from '@/helpers/HelperAuth';

export const handledErrorBingoCarton = (typeError: TErrorsService, options?: IOptionsError) => {
  switch (typeError) {
    case 'get':
      DispatchMessageService({
        action: 'show',
        type: 'error',
        msj: 'No se pudo obtener los cartones',
      });
      break;
    case 'add':
      DispatchMessageService({
        action: 'show',
        type: 'error',
        msj: 'No se pudo generar los cartones',
      });
      break;
    case 'delete':
      DispatchMessageService({
        action: 'show',
        type: 'error',
        msj: options?.plural
          ? 'No se pudieron eliminar los cartones'
          : options?.plural
          ? 'No se pudieron eliminar los cartones'
          : 'No se pudo eliminar el carton',
      });
      break;
  }
};

export const handledSuccesBingoCarton = (typeSucces: TSuccesService, options?: IOptionsSucces) => {
  const addMessagge = 'Se generaron correctamente los cartones';
  const deleteMessagge = options?.plural
    ? 'Se borraron correctamente los cartones'
    : 'Se borro el carton correctamente';
  switch (typeSucces) {
    case 'add':
      DispatchMessageService({
        action: 'show',
        type: 'success',
        msj: options?.overrideTitle ? options.overrideTitle : addMessagge,
      });
      break;
    case 'delete':
      DispatchMessageService({ action: 'show', type: 'success', msj: deleteMessagge });
      break;
  }
};

export const createBingoCartons = async (
  bingoId: string,
  cartonsNumber: number
): Promise<IResultPost<BingoCarton[]>> => {
  try {
    const res = await BingoApi.postBingoCartons(bingoId, cartonsNumber);
    handledSuccesBingoCarton('add');
    return {
      data: res,
      error: null,
    };
  } catch (error) {
    handledErrorBingoCarton('add');
    return {
      error,
    };
  }
};

export const deleteBingoCarton = async (bingoId: string, cartonId: string): Promise<IResultDelete> => {
  try {
    await BingoApi.deleteBingoCartons(bingoId, cartonId);
    handledSuccesBingoCarton('delete');
    return {
      error: null,
    };
  } catch (error) {
    handledErrorBingoCarton('delete');
    return {
      error,
    };
  }
};

export const deleteBingoCartonList = async (bingoId: string, notAssociated: boolean): Promise<IResultDelete> => {
  try {
    let token = await GetTokenUserFirebase();
    await privateInstance.delete(`api/bingos/${bingoId}/bingocards/?not_associated=${notAssociated}&token=${token}`);
    return {
      error: null,
    };
  } catch (error) {
    return {
      error,
    };
  }
};
