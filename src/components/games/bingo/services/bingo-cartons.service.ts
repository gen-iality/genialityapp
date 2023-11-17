import { IResultDelete, IResultPost, TErrorsService, TSuccesService } from '@/types';
import { BingoCarton } from '../interfaces/bingo';
import { BingoApi } from '@/helpers/request';
import { DispatchMessageService } from '@/context/MessageService';

export const handledErrorBingoCarton = (typeError: TErrorsService) => {
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

export const handledSuccesBingoCarton = (typeSucces: TSuccesService) => {
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

export const deleteBingoCartonList = async (bingoId: string, cartonIds: string[]): Promise<IResultDelete> => {
  try {
    let requestList: Promise<IResultDelete>[] = [];
    cartonIds.forEach((cartonId) => {
      requestList.push(deleteBingoCarton(bingoId, cartonId));
    });
    await Promise.all(requestList);
    return {
      error: null,
    };
  } catch (error) {
    return {
      error,
    };
  }
};
