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

    const getMeetings = async () => {
        try {
            const meetingWithUser = await servicesMeenting.listenMeetingsByUserLanding(eventContext.value._id, userEventContext.value._id)
            if (meetingWithUser.length === 0) {
                setListDays([])
                setHaveMeetings(false)
                return
            }
            setHaveMeetings(true)
            setListDays(getArraysDays(meetingWithUser));
        } catch (error) {
            setMeetingsByUser([])
        } finally {
            setLoading(false);
        }
    }

    const onSnapshot = (meetings: IMeeting[]) => {
        setMeetingsByUser(meetings);
        if (meetings.length === 0) {
            setHaveMeetings(false);

        }
    }

    const getArraysDays = (meetingWithUser: IMeeting[]) => {
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



    useEffect(() => {
        getMeetings()
    }, [])


    return {
        meetingsByUser,
        loading,
        listDays,
        haveMeetings
    }
}

export default useGetMeetingConfirmed