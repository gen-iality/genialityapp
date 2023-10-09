import { EventsApi } from '@/helpers/request';
import { notification } from 'antd';
import moment, { Moment } from 'moment';
import { useEffect, useState } from 'react';
import { dateToCustomDate } from '../utils/CustomMultiDate';
import { FORMAT_WITHOUT_HOUR } from '@/components/networking/utils/space-requesting.utils';

interface UseCustomDateEventProps {
  eventId: string;
}

export const dayToKey = (day: Date) => day.toISOString().substring(0, 10);

const sortDates = (b: DateRangeEvius, a: DateRangeEvius) => new Date(b.start).getTime() - new Date(a.start).getTime();

export const parseDate = (date: Date) => {
  const options: Intl.DateTimeFormatOptions = {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  };

  const fechaFormateada = date.toLocaleDateString('en-GB', options);

  return fechaFormateada.replace(',', '');
};

export interface DateRangeEvius {
  id: string;
  start: Date;
  end: Date;
}

interface DateOld {
  startDateOld: string;
  endDateOld: string;
}

export const useCustomDateEvent = (props: UseCustomDateEventProps) => {
  const [isFetching, setIsFetching] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [days, setDays] = useState<Date[]>([]);
  const [dates, setDates] = useState<DateRangeEvius[]>([]);
  const [mustUpdateDate, setMustUpdateDate] = useState(false);
  const [datesOld, setDatesOld] = useState<DateOld>();

  useEffect(() => {
    fetchEventData();
  }, []);

  const fetchEventData = async () => {
    try {
      setIsFetching(true);
      const data = await EventsApi.getOne(props.eventId);
      console.log(data);

      if (!data) return;
      const datesFetched = data.dates;

      if (!data.dates || data.dates.length === 0) {
        const dateStart = new Date(data.datetime_from);
        const dateEnd = new Date(data.datetime_to);

        const options: Intl.DateTimeFormatOptions = {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true,
        };

        setDatesOld({
          startDateOld: dateStart.toLocaleString(undefined, options),
          endDateOld: dateEnd.toLocaleString(undefined, options),
        });

        let newDateRanges = dateToCustomDate(dateStart, dateEnd);

        const days = newDateRanges.map((date) => new Date(date.start));
        setDays(days);
        setDates(newDateRanges);
        setMustUpdateDate(true);
        return;
      }

      const dates: DateRangeEvius[] = datesFetched.map((date: any) => {
        return {
          id: dayToKey(new Date(date.start)),
          start: new Date(date.start),
          end: new Date(date.end),
        };
      });

      const days = dates.map((date) => new Date(date.start));
      setDays(days);
      setDates(dates);
    } catch (error) {
      console.error(error);
    } finally {
      setIsFetching(false);
    }
  };

  const disabledDate = (current: Moment) => {
    const fechasPermitidas = dates.map((dateRange) => {
      return moment(dateRange.start).format(FORMAT_WITHOUT_HOUR);
    });

    const date_to_evaluate = moment(current).format(FORMAT_WITHOUT_HOUR);
    return fechasPermitidas.includes(date_to_evaluate);
  };

  const handleInterceptor = (fecha: Moment, horaInicio: Moment, horaFin: Moment) => {
    const currentDate = fecha.toDate();

    currentDate.setHours(horaInicio.toDate().getHours());
    currentDate.setMinutes(horaInicio.toDate().getMinutes());

    const currentDateStart = new Date(currentDate);
    const currentDateEnd = new Date(currentDate);

    currentDateEnd.setHours(horaFin.toDate().getHours());
    currentDateEnd.setMinutes(horaFin.toDate().getMinutes());

    const currentDates = [...dates];

    const newDateRangeEvius: DateRangeEvius = {
      id: dayToKey(currentDate),
      start: currentDateStart,
      end: currentDateEnd,
    };

    currentDates.push(newDateRangeEvius);

    currentDates.sort((a, b) => a.start.getTime() - b.start.getTime());

    setDates(currentDates);
  };
  const handledEdit = (fecha: Moment, horaInicio: Moment, horaFin: Moment, idToEdit: string) => {
    const currentDate = fecha.toDate();
    currentDate.setHours(horaInicio.toDate().getHours());
    currentDate.setMinutes(horaInicio.toDate().getMinutes());

    const currentDateStart = new Date(currentDate);
    const currentDateEnd = new Date(currentDate);

    currentDateEnd.setHours(horaFin.toDate().getHours());
    currentDateEnd.setMinutes(horaFin.toDate().getMinutes());

    const currentDates = [...dates];

    const newDateRangeEvius: DateRangeEvius = {
      id: dayToKey(currentDate),
      start: currentDateStart,
      end: currentDateEnd,
    };

    const newDates = currentDates.map((dateRange) => {
      if (dateRange.id === idToEdit) {
        return newDateRangeEvius;
      }
      return dateRange;
    });

    newDates.sort((a, b) => a.start.getTime() - b.start.getTime());

    setDates(newDates);
  };

  const handledDelete = (idToDelete: string) => {
    setDates(dates.filter((dateRange: DateRangeEvius) => dateRange.id !== idToDelete));
  };

  const handleUpdateTime = (
    dateKey: string,
    type: 'start' | 'end',
    value: moment.Moment | null,
    dateString: string
  ) => {
    if (!value) return;
    const dateToUpdate = dates.find((date) => date.id === dateKey);
    if (!dateToUpdate) return;
    const time = value.toDate();
    const date = dateToUpdate[type];
    date.setHours(time.getHours());
    date.setMinutes(time.getMinutes());
    const dateUpdated = {
      ...dateToUpdate,
      [type]: date,
    };
    setDates((prev) => [...prev.filter((date) => date.id !== dateKey), dateUpdated].sort(sortDates));
  };

  const handleSubmit = async () => {
    try {
      setIsSaving(true);
      const payload = dates.map((date) => {
        const dateStart = date.start;
        const dateEnd = date.end;

        return {
          start: parseDate(dateStart),
          end: parseDate(dateEnd),
        };
      });
      if (payload.length === 0 || !payload) {
        return notification.open({
          message: 'Datos no guardados',
          description: 'Debe crear por lo menos una fecha especifica',
        });
      }
      // Actualizar datetime_from y datetime_to en el formato deseado "AAAA-MM-DD HH:mm:ss"
      const dateStart = moment(dates[0].start, 'DD MMM YYYY HH:mm');
      const dateEnd = moment(dates[dates.length - 1].end, 'DD MMM YYYY HH:mm');
      const datetimeFromFormatted = dateStart.format('YYYY-MM-DD HH:mm:ss');
      const datetimeToFormatted = dateEnd.format('YYYY-MM-DD HH:mm:ss');

      await EventsApi.editOne(
        { dates: payload, datetime_from: datetimeFromFormatted, datetime_to: datetimeToFormatted },
        props.eventId
      );
      notification.open({
        message: 'Datos guardados',
        description: 'Las fechas especificas fueron guardadas',
      });
      setMustUpdateDate(false);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  return {
    isFetching,
    isSaving,
    days,
    dates,
    handleSubmit,
    handleUpdateTime,
    handleInterceptor,
    mustUpdateDate,
    datesOld,
    disabledDate,
    handledDelete,
    handledEdit,
  };
};
