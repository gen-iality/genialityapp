export const getEventDates = (event: any): { date_start: string; date_end: string } => {
    if (Array.isArray(event.dates)) {
      return {
        date_start: event.dates[0].start,
        date_end: event.dates[event.dates.length - 1].end,
      };
    } else {
      return {
        date_start: event.datetime_from,
        date_end: event.datetime_to,
      };
    }
  };
  