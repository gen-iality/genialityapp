import { useEffect, useState } from 'react'
import { UseUserEvent } from '@/context/eventUserContext';
import { UseEventContext } from '@/context/eventContext';
import * as servicesMeenting from '../services/meenting.service';
import { IMeeting } from '../interfaces/Meetings.interfaces';
import moment from 'moment';
import { DailyMeeting } from '../interfaces/my-agenda.interfaces';


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
        if (meetingList.length === 0) return setHaveMeetings(false)
        setHaveMeetings(true)
        setLoading(false)
        setMeetingsByUser(meetingList)
        setListDays(getArraysDays(meetingList));
    }


    const getArraysDays = (meetingWithUser: IMeeting[]): DailyMeeting[] => {
        const fechaInicial = new Date(eventContext.value.datetime_from);
        const fechaFinal = new Date(eventContext.value.datetime_to);
        const diasEnRango = [];

        let fechaActual = new Date(fechaInicial);
        while (fechaActual <= fechaFinal) {
            const dia = {
                date: moment(fechaActual).format('MMMM DD'),
                meetings: meetingWithUser.filter(meeting => moment(meeting.start).isSame(fechaActual, 'day'))
            };
            diasEnRango.push(dia);
            fechaActual.setDate(fechaActual.getDate() + 1);
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