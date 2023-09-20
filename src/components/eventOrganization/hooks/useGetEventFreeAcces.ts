import { OrganizationApi } from '@/helpers/request';
import { useEffect, useState } from 'react';

export const useGetEventsFreeAcces = (organizationId: string, eventUserId: string, eventUser: boolean = false) => {
  const [eventsFreeAcces, setEventsFreeAccess] = useState<any[]>([]);
  const [isLoadingEventFreeAcces, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    const getEventsFreeAcces = async () => {
      try {
        setIsLoading(true);
        const { free_events } = await OrganizationApi.getEventsFreeAcces(organizationId);
        setEventsFreeAccess(free_events);
      } catch (error) {
        setError('No se pudo obtener el los eventos con acceso libre');
      } finally {
        setIsLoading(false);
      }
    };
    getEventsFreeAcces();
  }, [organizationId, eventUserId]);

  return {
    eventsFreeAcces,
    isLoadingEventFreeAcces,
    error,
  };
};
