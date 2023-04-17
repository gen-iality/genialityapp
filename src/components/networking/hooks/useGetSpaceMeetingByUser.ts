import { useEffect, useState } from 'react'
import { Moment } from 'moment';
import useGetTimeParameter from './useGetTimeParametre';
import { generateSpaceMeetings } from '../utils/space-requesting.utils';
import { IMeetingRequestFirebase, SpaceMeeting } from '../interfaces/space-requesting.interface';
import { UseEventContext } from '@/context/eventContext';
import { listeningMeetingRequestByBothParticipants } from '../services/landing.service';



const useGetSpacesMeetingsByUser = (date: Moment, targetEventUserId: string, creatorEventUserId: string) => {
    const [spacesMeetingsToTargedUserLoading, setspacesMeetingsToTargedUserLoading] = useState(true)

    const [requestMeetings, setRequestMeetings] = useState<IMeetingRequestFirebase[]>([])

    const [spacesMeetingsToTargedUser, setSpacesMeetingsToTargedUser] = useState<SpaceMeeting[]>([])
    const eventContext = UseEventContext();
    const { timeParametres, timeParametreLoading } = useGetTimeParameter(eventContext.value._id)

    const onSetRequestMeetings = (data: IMeetingRequestFirebase[]) => {
        setRequestMeetings(data)
    }


    useEffect(() => {
        const unSubscribelisteningMeetingRequestByBothParticipants = listeningMeetingRequestByBothParticipants(eventContext.value._id, targetEventUserId, creatorEventUserId, date.format('YYYY-MM-DD'), onSetRequestMeetings)

        return () => {
            unSubscribelisteningMeetingRequestByBothParticipants()
        }
    }, [date, eventContext.value._id, targetEventUserId])

    useEffect(() => {
        if (timeParametres.withouParameters && timeParametres.withouParameters === true) {
            return setSpacesMeetingsToTargedUser([])
        }
        if (!timeParametreLoading) {
            const spaceRequestMeetings = generateSpaceMeetings(timeParametres, date, targetEventUserId, creatorEventUserId, requestMeetings)
            setSpacesMeetingsToTargedUser(spaceRequestMeetings)
            setspacesMeetingsToTargedUserLoading(false);
        }
    }, [date, targetEventUserId, timeParametreLoading, timeParametres, requestMeetings, creatorEventUserId])

    return {
        spacesMeetingsToTargedUser,
        spacesMeetingsToTargedUserLoading
    }
}

export default useGetSpacesMeetingsByUser