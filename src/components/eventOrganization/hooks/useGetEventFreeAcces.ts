import { OrganizationApi } from '@/helpers/request';
import { useEffect, useState, useCallback } from 'react';

export const useGetEventsFreeAcces = (organizationId: string, eventUser: boolean = false) => {
  const [eventsFreeAcces, setEventsFreeAccess] = useState<any[]>([]);
  const [isLoadingEventFreeAcces, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getEventsFreeAcces = useCallback(async (): Promise<any[]> => {
    try {
      const free_events = await OrganizationApi.getEventsInGroups(organizationId, true);
      if (Array.isArray(free_events)) return free_events;
      return [];
    } catch (error) {
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [organizationId]);

  useEffect(() => {
    const fetchEventsFree = async () => {
      try {
        setIsLoading(true);
        const free_events = await getEventsFreeAcces();
        if (Array.isArray(free_events)) setEventsFreeAccess(free_events);
        return free_events;
      } catch (error) {
        setError('No se pudo obtener los eventos con acceso libre');
        return [];
      } finally {
        setIsLoading(false);
      }
    };
    fetchEventsFree();
  }, [getEventsFreeAcces]);

  return {
    eventsFreeAcces,
    isLoadingEventFreeAcces,
    error,
    getEventsFreeAcces,
  };
};
