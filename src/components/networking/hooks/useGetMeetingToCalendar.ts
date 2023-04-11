import { useEffect, useState } from 'react'
import { IMeeting, IMeetingCalendar } from '../interfaces/Meetings.interfaces'
import { IObserver, TypeCalendarView } from '../interfaces/configurations.interfaces';
import { GroupByResources } from '../interfaces/groupBy-interfaces';

const useGetMeetingToCalendar = (meetings: IMeeting[], currentView: string, observers: IObserver[], DataCalendar: IMeetingCalendar[], groupBy: GroupByResources) => {
    const [renderEvents, setRenderEvents] = useState<any[]>([]);
    useEffect(() => {
        if ([TypeCalendarView.day, TypeCalendarView.week].includes(currentView as TypeCalendarView) && observers.length && groupBy === 'observers') {
            return setRenderEvents(DataCalendar);
        }
        setRenderEvents(meetings.map((meeting) => ({
            ...meeting,
            start: new Date(meeting.start),
            end: new Date(meeting.end),
        })))
    }, [meetings, currentView, groupBy])

    return {
        renderEvents
    }
}

export default useGetMeetingToCalendar