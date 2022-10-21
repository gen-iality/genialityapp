import { SurveysApi } from '@helpers/request';
import { DispatchMessageService } from '@/context/MessageService';
export const sendCommunicationOpen = async (survey_id) => {
  try {
    const response = await SurveysApi.sendCommunicationOpen(survey_id);
    if (response) {
      DispatchMessageService({
        type: 'success',
        msj: 'Comunicado enviado con exito',
        acion: 'show',
      });
    }
    return;
  } catch (error) {
    DispatchMessageService({
      type: 'error',
      msj: 'No se pudo enviar el comunicado',
      acion: 'show',
    });
    console.error(error);
  }
};

export const sendCommunicationUser = async (survey_id, evenUserID) => {
  try {
    const response = await SurveysApi.sendCommunicationUser(survey_id, evenUserID);
    if (response) {
      DispatchMessageService({
        type: 'success',
        msj: 'Enviado con exito',
        acion: 'show',
      });
    }
    return;
  } catch (error) {
    DispatchMessageService({
      type: 'error',
      msj: 'No se pudo enviar',
      acion: 'show',
    });
    console.error(error);
  }
};
