import { useEffect, useState } from 'react'
import { getMeetingForUsers } from '../services/landing.service'
import { IMeeting } from '../interfaces/Meetings.interfaces'

const useGetMeetingForTowUsers = (eventId: string, users: string[]) => {
    const [requestMeeting, setRequestMeeting] = useState<IMeeting[]>([] as IMeeting[])
    const [loading, setloading] = useState(true)
    const [error, setError] = useState()
    useEffect(() => {
        getData(eventId, users)
    }, [eventId, users])

    const getData = async (eventId: string, users: string[]) => {
        try {
            const requestMeeting = await getMeetingForUsers(eventId, users)
            if (requestMeeting) setRequestMeeting(requestMeeting)
            setloading(false)
        } catch (error) {
            setloading(false)
            setError(error as any)
        }
    }
    return {
        loading,
        requestMeeting,
        error
    }
}

export default useGetMeetingForTowUsers