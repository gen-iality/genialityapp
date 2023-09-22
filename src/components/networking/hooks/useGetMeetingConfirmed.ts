import { useEffect, useState } from 'react'
import { UseUserEvent } from '@/context/eventUserContext';
import { UseEventContext } from '@/context/eventContext';
import * as servicesMeenting from '../services/meenting.service';
import { IMeeting } from '../interfaces/Meetings.interfaces';
import moment from 'moment';
import { DailyMeeting } from '../interfaces/my-agenda.interfaces';
import { DateRange } from 'react-big-calendar';


const useGetMeetingConfirmed = () => {
    let userEventContext = UseUserEvent();
    const eventContext = UseEventContext();

    const [loading, setLoading] = useState(true)
    const [meetingsByUser, setMeetingsByUser] = useState<IMeeting[]>([])
    const [listDays, setListDays] = useState<DailyMeeting[]>([])
    const [haveMeetings, setHaveMeetings] = useState(false)


    useEffect(() => {
        const unSubscribeListenMeetingsByUserLanding = servicesMeenting.listenMeetingsByUserLanding(eventContext.value._id, userEventContext.value._id, onSetMeetingList)

        return () => {
            unSubscribeListenMeetingsByUserLanding()
        }
    }, [])

    const onSetMeetingList = (meetingList: IMeeting[]) => {
        if (meetingList.length === 0) {
            setLoading(false)
            setHaveMeetings(false)
            return
        }
        setLoading(false)
        setMeetingsByUser(meetingList)
        setListDays(getArraysDays(meetingList));
    }


    const getArraysDays = (meetingWithUser: IMeeting[]): DailyMeeting[] => {
        const diasEnRango: DailyMeeting[] = [];
        setHaveMeetings(false)

        if (Array.isArray(eventContext?.value?.dates)) {
            eventContext?.value?.dates.forEach((element: DateRange) => {
                const fechaActual = new Date(element.start)
                const meeting = meetingWithUser.filter(meeting => {
                    return moment(meeting.start).isSame(fechaActual, 'day') && moment(meeting.start).isSame(fechaActual, 'month') && moment(meeting.start).isSame(fechaActual, 'year')
                })
                if (meeting.length > 0) {
                    setHaveMeetings(true)
                }
                const dia = {
                    date: moment(fechaActual).format('MMMM DD'),
                    meetings: meeting
                };
                diasEnRango.push(dia);
                fechaActual.setDate(fechaActual.getDate() + 1);
            });
        }
        return diasEnRango;
    };



    return {
        meetingsByUser,
        loading,
        listDays,
        haveMeetings
    }
}

export default useGetMeetingConfirmed