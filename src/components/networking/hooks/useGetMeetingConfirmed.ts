import { useEffect, useState } from 'react'
import { UseUserEvent } from '@/context/eventUserContext';
import { UseEventContext } from '@/context/eventContext';
import * as servicesMeenting from '../services/meenting.service';
import { IMeeting } from '../interfaces/Meetings.interfaces';


const useGetMeetingConfirmed = () => {
    let userEventContext = UseUserEvent();
    const eventContext = UseEventContext();
    const [loading, setLoading] = useState(true)
    const [meetingsByUser, setMeetingsByUser] = useState<IMeeting[]>([])
    useEffect(() => {
        getMeetings()
    }, [])


    const getMeetings = async () => {
        try {
            setLoading(true)
            servicesMeenting.listenMeetingsByUserLanding(eventContext.value._id, userEventContext.value.user._id, setMeetingsByUser)
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
    return {
        meetingsByUser,
        loading
    }
}

export default useGetMeetingConfirmed