import { useEffect, useState } from 'react'
import { Moment } from 'moment';
import useGetTimeParameter from './useGetTimeParametre';
import { generateSpaceMeetings } from '../utils/space-requesting.utils';
import { SpaceMeetingFirebase } from '../interfaces/space-requesting.interface';
import { createSpacesRequestMeetingsWithList, listeningSpacesRequestMeetings } from '../services/landing.service';
import { UseUserEvent } from '@/context/eventUserContext';
import { UseEventContext } from '@/context/eventContext';



const useGetSpacesMeetingsByUser = (date: Moment) => {
    const [spacesMeetings, setSpacesMeetings] = useState<SpaceMeetingFirebase[] | 'initial'>('initial')
    const [spaceMeetingLoading, setSpaceMeetingLoading] = useState(true)
    const { timeParametres, timeParametreLoading } = useGetTimeParameter()
    const userEventContext = UseUserEvent();
    const eventContext = UseEventContext();


    const onSet = (spacesMeetingsFirebase: SpaceMeetingFirebase[]) => {
        setSpaceMeetingLoading(false);
        setSpacesMeetings(spacesMeetingsFirebase)
    }
    useEffect(() => {
        const unSubscribeListeningSpacesRequestMeetings = listeningSpacesRequestMeetings(eventContext.value._id, userEventContext.value._id, date.format('YYYY-MM-DD'), onSet)
        return () => {
            unSubscribeListeningSpacesRequestMeetings()
        }
    }, [timeParametres, date])


    useEffect(() => {
        if (spacesMeetings !== 'initial' && spacesMeetings.length === 0 && !timeParametreLoading) {
            const spaceRequestMeetings = generateSpaceMeetings(timeParametres, date, userEventContext.value._id)
            createSpacesRequestMeetingsWithList(eventContext.value._id, spaceRequestMeetings)
        }
    }, [spacesMeetings, timeParametreLoading])

    return {
        spacesMeetings,
        spaceMeetingLoading
    }
}

export default useGetSpacesMeetingsByUser