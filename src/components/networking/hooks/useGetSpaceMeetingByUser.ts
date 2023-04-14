import { useEffect, useState } from 'react'
import { Moment } from 'moment';
import useGetTimeParameter from './useGetTimeParametre';
import { generateSpaceMeetings } from '../utils/space-requesting.utils';
import { SpaceMeeting, SpaceMeetingFirebase } from '../interfaces/space-requesting.interface';
import { UseEventContext } from '@/context/eventContext';
import { listeningSpacesAgendedMeetings } from '../services/landing.service';



const useGetSpacesMeetingsByUser = (date: Moment, targetEventUserId: string) => {
    const [spacesMeetingsAgended, setSpacesMeetingsAgended] = useState<SpaceMeetingFirebase[]>([])
    const [spacesMeetingsToTargedUser, setSpacesMeetingsToTargedUser] = useState<SpaceMeeting[]>([])
    const [spacesMeetingsToTargedUserLoading, setspacesMeetingsToTargedUserLoading] = useState(true)
    const eventContext = UseEventContext();
    const { timeParametres, timeParametreLoading } = useGetTimeParameter(eventContext.value._id)

    const onSet = (data: SpaceMeetingFirebase[]) => {
        setspacesMeetingsToTargedUserLoading(false);
        setSpacesMeetingsAgended(data)
    }
    useEffect(() => {
        const unSubscribelisteningSpacesAgendedMeetings = listeningSpacesAgendedMeetings(eventContext.value._id, targetEventUserId, date.format('YYYY-MM-DD'), onSet)
        return () => {
            unSubscribelisteningSpacesAgendedMeetings()
        }
    }, [date, eventContext.value._id, targetEventUserId])

    useEffect(() => {
        if (!timeParametreLoading) {
            const spaceRequestMeetings = generateSpaceMeetings(timeParametres, date, targetEventUserId, spacesMeetingsAgended)
            setSpacesMeetingsToTargedUser(spaceRequestMeetings)
        }
    }, [date, targetEventUserId, timeParametreLoading, spacesMeetingsAgended, timeParametres])

    return {
        spacesMeetingsToTargedUser,
        spacesMeetingsToTargedUserLoading
    }
}

export default useGetSpacesMeetingsByUser