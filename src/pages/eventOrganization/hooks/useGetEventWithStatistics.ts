import { useEffect, useState } from 'react'
import { OrganizationApi } from '@/helpers/request';
import { usePaginationListLocal } from '@/hooks/usePaginationListLocal';

export const useGetEventWithStatistics = (organizationId:string) => {
    const [eventData, setEventData] = useState([]);
    const [isLoading, setisLoading] = useState(true);
    const {pagination}=  usePaginationListLocal(eventData)
  
    const getData = async () => {
      try {
        const { data } = await OrganizationApi.getEventsStatistics(organizationId, 'latest');
        setEventData(data)
      } catch (error) {
        setEventData([])
      }finally{
        setisLoading(false)
      }
    };
  
    useEffect(() => {
      getData();
    }, [organizationId]);
  
    return {
      eventData,
      isLoading,
      pagination
    };
}
