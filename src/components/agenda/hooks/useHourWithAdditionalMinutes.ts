import { useCallback } from 'react';
import dayjs from 'dayjs';

export const hourWithAdditionalMinutes = (minutes: number) => {
  const fecha = new Date();
  fecha.setMinutes(fecha.getMinutes() + minutes);
  const m = dayjs(fecha);
  return m;
};

export default function useHourWithAdditionalMinutes() {
  return useCallback(hourWithAdditionalMinutes, []);
}
