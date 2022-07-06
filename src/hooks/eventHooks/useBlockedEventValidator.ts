import moment from 'moment';

export const useBlockedEventValidator = (event: any, cUser: any) => {
  if (!event) return null;

  if (!cUser) return null;

  let actualDate = new Date(event.value?.datetime_to);
  let dayUserOrEvent = cUser?.value?.plan
    ? cUser?.value?.plan?.availables?.streaming_hours / 60 / 24
    : event.value?.later_days / 60 / 24;
  let blockedDate = new Date(actualDate.setDate(actualDate.getDate() + dayUserOrEvent));
  let formatDate = moment(blockedDate).format('DD-MM-YYYY');
  const blockedEventDate = formatDate;

  return {
    isBlocked: new Date() > blockedDate ? true : false,
    formatDate: blockedEventDate,
  };
};
