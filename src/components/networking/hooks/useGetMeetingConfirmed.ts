import { useEffect, useState } from 'react'
import { UseUserEvent } from '@/context/eventUserContext';
import { UseEventContext } from '@/context/eventContext';
import * as servicesMeenting from '../services/meenting.service';
import { IMeeting } from '../interfaces/Meetings.interfaces';
import moment from 'moment';

interface DailyMeeting {
    date: string;
    meetings: IMeeting[];
}
const useGetMeetingConfirmed = () => {
    let userEventContext = UseUserEvent();
    const eventContext = UseEventContext();
    const [loading, setLoading] = useState(true)
    const [meetingsByUser, setMeetingsByUser] = useState<IMeeting[]>([])
    const [listDays, setListDays] = useState<DailyMeeting[]>([])
    useEffect(() => {
        getMeetings()
        getArraysDays()
    }, [])

    const getMeetings = async () => {
        try {
            setLoading(true)
            servicesMeenting.listenMeetingsByUserLanding(eventContext.value._id, userEventContext.value._id, setMeetingsByUser)
        } catch (error) {
            setMeetingsByUser([])
        } finally {
            setLoading(false)
            return {
                meetingsByUser,
                loading
            }
        }
    }


    const getArraysDays = () => {
        const fechaInicial = new Date(eventContext.value.datetime_from);
        const fechaFinal = new Date(eventContext.value.datetime_to);
        const diasEnRango = [];

        let fechaActual = new Date(fechaInicial);
        while (fechaActual <= fechaFinal) {
            console.log('meetingsByUser--------------',meetingsByUser)
            const dia = {
                date: fechaActual.toLocaleDateString('es-ES', { month: 'long', day: 'numeric' }),
                meetings: meetingsByUser.filter(meeting => {
                    console.log('moment(meeting.start)',{
                        start:moment(meeting.start),
                        actual:fechaActual,
                        boolean:moment(meeting.start).isSame(fechaActual, 'day')
                    })
                    return moment(meeting.start).isSame(fechaActual, 'day')
                })
            };
            diasEnRango.push(dia);
            fechaActual.setDate(fechaActual.getDate() + 1);
        }
        setListDays(diasEnRango);
    };



    return {
        meetingsByUser,
        loading,
        listDays
    }
}

export default useGetMeetingConfirmed