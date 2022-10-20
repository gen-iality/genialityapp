import { DispatchMessageService } from '@context/MessageService';
import { AlertsPlanApi } from '@helpers/request';
import dayjs from 'dayjs';

export const useBlockedEventValidator = (event: any, cUser: any) => {
  if (!event) return null;

  if (!cUser) return null;

  const actualDate = new Date(event.value?.datetime_to);
  const dayUserOrEvent = cUser?.value?.plan ? cUser?.value?.plan?.availables?.later_days : event.value?.later_days;

  const blockedDate = new Date(actualDate.setDate(actualDate.getDate() + dayUserOrEvent));
  const formatDate = dayjs(blockedDate).format('DD-MM-YYYY');
  const blockedEventDate = formatDate;

  if (new Date() > blockedDate) {
    const blockedMessage = async () => {
      try {
        const message = await AlertsPlanApi.createOne({
          message: 'Curso bloqueado sin días posteriores',
          status: 'ACTIVE',
          user_id: cUser.value?._id,
        });
        if (message) {
          DispatchMessageService({
            type: 'success',
            msj: `Ya no puedes ver el curso`,
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
