import { OrganizationFuction } from '@/helpers/request';
import { useEffect, useState } from 'react';

export const useGetEventsByOrg = (organizationId: string) => {
  const [eventsByOrg, setEventsByOrg] = useState<any[]>([]);
  const [isLoadingEventsByOrg, setIsLoadingEventsByOrg] = useState(true);

  useEffect(() => {
    const getEventsByOrg = async () => {
      try {
        setIsLoadingEventsByOrg(true);
        const data = await OrganizationFuction.getEventsNextByOrg(organizationId);
        setEventsByOrg(data);
        setIsLoadingEventsByOrg(false);
      } catch (error) {
        setIsLoadingEventsByOrg(false);
      }
    };
    getEventsByOrg();
  }, [organizationId]);

  return { eventsByOrg, isLoadingEventsByOrg };
};
