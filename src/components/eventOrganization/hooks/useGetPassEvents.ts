import { useCallback, useEffect, useState } from 'react';
import { OrganizationFuction } from '@/helpers/request';
import moment from 'moment';

const useGetPassEvents = (organizationId: string) => {
  const [passEvents, setPassEvents] = useState<any[]>([]);
  const [isLoadingPassEvents, setisLoadingPassEvents] = useState(true);

  const getPassEvents = useCallback(async (): Promise<any[]> => {
    try {
      const currentDate = moment().format('YYYY-MM-DD');

      const data = await OrganizationFuction.getEventsNextByOrg(organizationId, 'desc', currentDate, 'past');
      return data;
    } catch (error) {
      throw error;
    }
  }, [organizationId]);

  const fetchData = useCallback(async () => {
    try {
      const passEvents = await getPassEvents();
      setPassEvents(passEvents);
      setisLoadingPassEvents(false);
    } catch (error) {
      setisLoadingPassEvents(false);
    }
  }, [getPassEvents]);

  useEffect(() => {
    fetchData();
  }, [organizationId, fetchData]);

  return { passEvents, isLoadingPassEvents, getPassEvents, fetchData };
};

export default useGetPassEvents;
