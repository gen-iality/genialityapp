import { update } from './../../sharePhoto/services/index';
import { async } from 'ramda-adjunct';
import { WhoWantsToBeAMillonaireApi } from '@/helpers/request';
import { DispatchMessageService } from '@/context/MessageService';
import event from '@/components/events/event';
export const CreateMillonaireApi = async (
  eventId: string,
  data: { name: string; number_of_questions: number | null; rules?: string; time_for_question?: number }
) => {
  try {
    const response = await WhoWantsToBeAMillonaireApi.createOne(eventId, data);
    return response;
  } catch (error) {
    DispatchMessageService({ type: 'error', msj: 'Error al crear la dinamica', action: 'show' });
    return null;
  }
};

export const GetMillonaireAPi = async (eventId: string) => {
  try {
    const response = await WhoWantsToBeAMillonaireApi.getOne(eventId);
    return response;
  } catch (error) {
    DispatchMessageService({ type: 'error', msj: 'Error al obtener la informacion', action: 'show' });
    return null;
  }
};

export const UpdateMillonaireApi = async (
  eventId: string,
  millonaireId: string,
  data: { name: string; number_of_questions: number | null; rules?: string; time_for_question?: number }
) => {
  try {
    const response = await WhoWantsToBeAMillonaireApi.editOne(eventId, millonaireId, data);
    return response;
  } catch (error) {
    DispatchMessageService({ type: 'error', msj: 'Error al actualizar la dinamica', action: 'show' });
    return null;
  }
};

export const DeleteMillonairApi = async (eventId: string, millonaireId: string) => {
  try {
    await WhoWantsToBeAMillonaireApi.deleteOne(eventId, millonaireId);
    return true;
  } catch (error) {
    DispatchMessageService({ type: 'error', msj: 'Error al eliminar la dinamica', action: 'show' });
    return null;
  }
};
