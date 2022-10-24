import { useCallback } from 'react';
import moment from 'moment';

export const hourWithAdditionalMinutes = (minutes: number) => {
  const fecha = new Date();
  fecha.setMinutes(fecha.getMinutes() + minutes);
  const m = moment(fecha, 'HH:mm:ss');
  /* console.debug('create new default moment:', m); */
  return m;
};

export default function useHourWithAdditionalMinutes() {
  return useCallback(hourWithAdditionalMinutes, []);
}
