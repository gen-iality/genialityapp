import moment from 'moment';

export const useConvertUTC = (date: Date, format: string) => {
  if (!date) return null;
  if (!format) format = 'YYYY-MM-DD HH:mm:ss';

  let newDate = new Date(date);

  //Es la versión más corta para hacer la conversión a la hora local, queda en caso de ser necesaria o si se ve que falle la 2da opción.
  let normalNewDate = moment(new Date(newDate.getTime() - newDate.getTimezoneOffset() * 60 * 1000)).format(format);

  //Es la versión extendida con moment para hacer la conversión a la hora local, es un poco más larga pero está funcional
  let newDateWithMoment = moment(newDate)
    .subtract(new Date(newDate).getTimezoneOffset() / 60, 'hours')
    .format(format);

  if (newDateWithMoment === 'Invalid date') newDateWithMoment = '';

  return {
    normalNewDate: normalNewDate,
    newDateWithMoment: newDateWithMoment,
  };
};
