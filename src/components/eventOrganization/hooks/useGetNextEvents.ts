import { useCallback, useEffect, useState } from 'react';
import { OrganizationFuction } from '@/helpers/request';
import moment from 'moment';

const useGetNextEvents = (organizationId: string) => {
  const [nextEvents, setNextEvents] = useState<any[]>([]);
  const [isLoadingNextEvents, setisLoadingNextEvents] = useState(true);

  const getNextEvents = useCallback(async (): Promise<any[]> => {
    try {
      const currentDate = moment().format('YYYY-MM-DD');
      const data = await OrganizationFuction.getEventsNextByOrg(organizationId, 'asc', currentDate, 'future');
      return data;
    } catch (error) {
      throw error;
    }
  }, [organizationId]);

  const fetchData = useCallback(async () => {
    try {
      const nextEvents = await getNextEvents();
      setNextEvents(nextEvents);
      setisLoadingNextEvents(false);
    } catch (error) {
      setisLoadingNextEvents(false);
    }
  }, [getNextEvents]);

  useEffect(() => {
    fetchData();
  }, [organizationId, fetchData]);

  return { nextEvents, isLoadingNextEvents, getNextEvents, fetchData };
};

export default useGetNextEvents;
