import { DataEvent } from '../interfaces/ExcelEvent.interface';

export const parseDataToExcel = (events: any[]): DataEvent[] => {
  return events.map((event) => {
    const startDate = event.dates[0]?.start ?? event.datetime_from;
    return {
      _id: event._id,
      name: event.name,
      startDate,
      count: event.count,
      speaker: [],
      documentsUrls: [],
      videoUrls: [],
    };
  });
};
