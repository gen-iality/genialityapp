import React, { useEffect, useState } from 'react';
import * as servicesMeenting from '../services/meenting.service';
import { UseEventContext } from '@/context/eventContext';
import { IMeeting } from '../interfaces/Meetings.interfaces';
import { DocumentData, QueryDocumentSnapshot } from 'firebase/firestore';

export const useGetMeetings = () => {
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState<QueryDocumentSnapshot<DocumentData> | null>(null)
  const [meetings, setMeetings] = useState<IMeeting[]>([]);
  const eventContext = UseEventContext();

  const onSetMeetings= (meentings: any[]) => {
    setLoading(false);
    setMeetings(meentings);
  };

  const getMeetings = async (pagination : any) =>{
   /*  const {data, lastVisible , FirtsVisible} = await servicesMeenting.GetMeetingsByPagination(eventContext.value._id, pagination)
    setPagination(lastVisible)
    onSetMeetings(data) */
    
} 

  useEffect(() => {
    const unSubcribeMeentings = servicesMeenting.listenMeetings(eventContext.value._id, onSetMeetings)
    return () => {
        unSubcribeMeentings();
      };
}, []);

  return {
    pagination,
    meetings,
    loading,
    getMeetings
  };
};
