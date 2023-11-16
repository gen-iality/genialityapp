import { IResultDelete, IResultPost, TErrorsServiceCartons, TSuccesServiceCartons } from '@/types';
import { BingoCarton } from '../interfaces/bingo';
import { BingoApi } from '@/helpers/request';
import { DispatchMessageService } from '@/context/MessageService';

export const handledErrorBingoCarton = (typeError: TErrorsServiceCartons) => {
  switch (typeError) {
    case 'get':
      DispatchMessageService({ action: 'show', type: 'error', msj: 'No se pudo obtener los cartones' });
      break;
    case 'add':
      DispatchMessageService({ action: 'show', type: 'error', msj: 'No se pudo generar los cartones' });
      break;
    case 'delete':
      DispatchMessageService({ action: 'show', type: 'error', msj: 'No se pudo eliminar el carton' });
      break;
  }
};

export const handledSuccesBingoCarton = (typeSucces: TSuccesServiceCartons) => {
  switch (typeSucces) {
    case 'add':
      DispatchMessageService({ action: 'show', type: 'success', msj: 'Se generaron correctamente los cartones' });
      break;
    case 'delete':
      DispatchMessageService({ action: 'show', type: 'success', msj: 'Se borro el carton correctamente' });
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
      ok: true,
    };
  } catch (error) {
    handledErrorBingoCarton('add');
    return {
      ok: false,
    };
  }
};

export const deleteBingoCarton = async (bingoId: string, cartonId: string): Promise<IResultDelete> => {
  try {
    await BingoApi.deleteBingoCartons(bingoId);
    handledSuccesBingoCarton('delete');
    return {
      ok: true,
    };
  } catch (error) {
    handledErrorBingoCarton('delete');
    return {
      ok: false,
    };
  }
};
