import { useEffect, useState } from 'react'
import { Moment } from 'moment';
import useGetTimeParameter from './useGetTimeParametre';
import { generateSpaceMeetings, generateSpacesByDataRange } from '../utils/space-requesting.utils';
import { IMeetingRequestFirebase, SpaceMeeting } from '../interfaces/space-requesting.interface';
import { UseEventContext } from '@/context/eventContext';
import { listeningMeetingRequestByBothParticipants } from '../services/landing.service';
import { useGetMultiDate } from '@/hooks/useGetMultiDate';



const useGetSpaces = (date: Moment, targetEventUserId: string, creatorEventUserId: string) => {
    const eventContext = UseEventContext();
    const [spacesMeetingsToTargedUserLoading, setspacesMeetingsToTargedUserLoading] = useState(true)
    const [requestMeetings, setRequestMeetings] = useState<IMeetingRequestFirebase[]>([])
    const [spacesMeetingsToTargedUser, setSpacesMeetingsToTargedUser] = useState<SpaceMeeting[]>([])
    const { multiDates } = useGetMultiDate(eventContext.value._id)
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
            setspacesMeetingsToTargedUserLoading(false);
            return setSpacesMeetingsToTargedUser([])
        }
        if (!timeParametreLoading && multiDates.length > 0) {
            const spaceRequestMeetings = generateSpacesByDataRange(timeParametres, date, targetEventUserId, creatorEventUserId, requestMeetings, multiDates)
            setSpacesMeetingsToTargedUser(spaceRequestMeetings)
            setspacesMeetingsToTargedUserLoading(false);
        }
    }, [date, targetEventUserId, timeParametreLoading, timeParametres, requestMeetings, creatorEventUserId, multiDates])

    return {
        spacesMeetingsToTargedUser,
        spacesMeetingsToTargedUserLoading
    }
}

export default useGetSpaces