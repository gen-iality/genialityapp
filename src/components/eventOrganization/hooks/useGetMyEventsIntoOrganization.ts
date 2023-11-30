import { useEffect, useState } from 'react';
import { getMyEventsIntoOrganization } from '../services/landing-organizations.service';

interface IOptions {
  organizationId: string;
}

export const useGetMyEventsIntoOrganization = (options: IOptions) => {
  const [myEventsIntoOrganization, setMyEventsIntoOrganization] = useState<any[]>([]);
  const [isLoadingMyEvents, setIsLoadingMyEvents] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const getMyEvents = async () => {
      setIsLoadingMyEvents(true);

      const { data, error } = await getMyEventsIntoOrganization(options.organizationId);

      if (isMounted && !error) {
        setMyEventsIntoOrganization(data);
      }

      if (isMounted) {
        setIsLoadingMyEvents(false);
      }
    };

    getMyEvents();

    return () => {
      isMounted = false;
    };
  }, [options.organizationId]);

  return {
    myEventsIntoOrganization,
    isLoadingMyEvents,
  };
};
