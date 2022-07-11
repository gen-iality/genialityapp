import { DispatchMessageService } from '@/context/MessageService';
import { AlertsPlanApi } from '@/helpers/request';
import moment from 'moment';

export const useBlockedEventValidator = (event: any, cUser: any) => {
  if (!event) return null;

  if (!cUser) return null;

  let actualDate = new Date(event.value?.datetime_to);
  let dayUserOrEvent = cUser?.value?.plan
    ? cUser?.value?.plan?.availables?.later_days / 60 / 24
    : event.value?.later_days / 60 / 24;

  let blockedDate = new Date(actualDate.setDate(actualDate.getDate() + dayUserOrEvent));
  let formatDate = moment(blockedDate).format('DD-MM-YYYY');
  const blockedEventDate = formatDate;

  console.log(cUser.value._id);

  if (new Date() > blockedDate) {
    const blockedMessage = async () => {
      try {
        let message = await AlertsPlanApi.createOne({
          message: 'Evento bloqueado sin días posteriores',
          status: 'ACTIVE',
          user_id: cUser.value._id,
        });
        if (message) {
          DispatchMessageService({
            type: 'success',
            msj: `Ya no puedes ver el evento`,
            action: 'show',
          });
        }
      } catch (error) {
        DispatchMessageService({
          type: 'error',
          msj: `No se pudo cambiar el mensaje`,
          action: 'show',
        });
      }
    };

    blockedMessage();
  }

  return {
    isBlocked: new Date() > blockedDate ? true : false,
    formatDate: blockedEventDate,
  };
};
