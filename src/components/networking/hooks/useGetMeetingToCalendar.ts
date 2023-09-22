import { useEffect, useState } from 'react';
import { IMeeting, IMeetingCalendar } from '../interfaces/Meetings.interfaces';
import { IObserver, TypeCalendarView } from '../interfaces/configurations.interfaces';
import { GroupByResources } from '../interfaces/groupBy-interfaces';

const useGetMeetingToCalendar = (
  meetings: IMeeting[],
  currentView: string,
  observers: IObserver[],
  groupBy: GroupByResources
) => {
  const [renderEvents, setRenderEvents] = useState<IMeetingCalendar[]>([]);

  const meetingsByObservers = () => {
    const dataArray: IMeetingCalendar[] = [];
    observers.map((observer) => {
      meetings.map((meeting) => {
        if (meeting.participantsIds && meeting.participantsIds.includes(observer.value)) {
          dataArray.push({
            ...meeting,
            assigned: observer.value,
            start: new Date(meeting.start),
            end: new Date(meeting.end),
          });
        }
      });
    });
    return dataArray;
  };

  useEffect(() => {
    if (
      [TypeCalendarView.day, TypeCalendarView.week].includes(currentView as TypeCalendarView) &&
      observers.length &&
      groupBy === 'observers'
    ) {
      return setRenderEvents(meetingsByObservers());
    }
    setRenderEvents(
      meetings.map((meeting) => ({
        ...meeting,
        start: new Date(meeting.start),
        end: new Date(meeting.end),
      }))
    );
  }, [meetings, currentView, groupBy]);

  return {
    renderEvents,
  };
};

export default useGetMeetingToCalendar;
