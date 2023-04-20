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
        const fechaInicial = new Date(eventContext.value.datetime_from);
        const fechaFinal = new Date(eventContext.value.datetime_to);
        const diasEnRango = [];
        setHaveMeetings(false)
        let fechaActual = new Date(fechaInicial);
        while (fechaActual <= fechaFinal) {
            const meeting = meetingWithUser.filter(meeting => moment(meeting.start).isSame(fechaActual, 'day'))
            //Se valida asi debido a que pueden existir reuniones del cms que no son validas para mostrar en la landing
            if (meeting.length > 0) {
                setHaveMeetings(true)
            }
            const dia = {
                date: moment(fechaActual).format('MMMM DD'),
                meetings: meeting
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