import { useEffect, useState } from 'react'
import { Moment } from 'moment';
import useGetTimeParameter from './useGetTimeParametre';
import { generateSpaceMeetings } from '../utils/space-requesting.utils';
import { IMeetingRequestFirebase, SpaceMeeting, SpaceMeetingFirebase } from '../interfaces/space-requesting.interface';
import { UseEventContext } from '@/context/eventContext';
import { listeningMeetingRequestByBothParticipants, listeningSpacesAgendedMeetings } from '../services/landing.service';



const useGetSpacesMeetingsByUser = (date: Moment, targetEventUserId: string, creatorEventUserId: string) => {
    const [spacesMeetingsAgended, setSpacesMeetingsAgended] = useState<SpaceMeetingFirebase[]>([])
    const [spacesMeetingsToTargedUserLoading, setspacesMeetingsToTargedUserLoading] = useState(true)
    
    const [requestMeetings, setRequestMeetings] = useState<IMeetingRequestFirebase[]>([])
    const [requestMeetingsLoading, setRequestMeetingsLoading] = useState(true)

    const [spacesMeetingsToTargedUser, setSpacesMeetingsToTargedUser] = useState<SpaceMeeting[]>([])
    const eventContext = UseEventContext();
    const { timeParametres, timeParametreLoading } = useGetTimeParameter(eventContext.value._id)

    const onSetRequestMeetings = (data: IMeetingRequestFirebase[]) => {
        setRequestMeetingsLoading(false);
        setRequestMeetings(data)
    }

    const onSetSpacesMeetingsAgended = (data: SpaceMeetingFirebase[]) => {
        setspacesMeetingsToTargedUserLoading(false);
        setSpacesMeetingsAgended(data)
    }
    useEffect(() => {
        const unSubscribelisteningSpacesAgendedMeetings = listeningSpacesAgendedMeetings(eventContext.value._id, targetEventUserId, date.format('YYYY-MM-DD'), onSetSpacesMeetingsAgended)
        const unSubscribelisteningMeetingRequestByBothParticipants = listeningMeetingRequestByBothParticipants(eventContext.value._id, targetEventUserId, creatorEventUserId, date.format('YYYY-MM-DD'), onSetRequestMeetings)

        return () => {
            unSubscribelisteningSpacesAgendedMeetings()
            unSubscribelisteningMeetingRequestByBothParticipants()
        }
    }, [date, eventContext.value._id, targetEventUserId])

    useEffect(() => {

        if (!timeParametreLoading) {
            const spaceRequestMeetings = generateSpaceMeetings(timeParametres, date, targetEventUserId, creatorEventUserId, spacesMeetingsAgended, requestMeetings)
            setSpacesMeetingsToTargedUser(spaceRequestMeetings)
        }
    }, [date, targetEventUserId, timeParametreLoading, spacesMeetingsAgended, timeParametres, requestMeetings])

    return {
        spacesMeetingsToTargedUser,
        spacesMeetingsToTargedUserLoading
    }
}

export default useGetSpacesMeetingsByUser