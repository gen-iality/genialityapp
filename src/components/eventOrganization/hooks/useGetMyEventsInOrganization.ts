import { OrganizationApi } from '@/helpers/request';
import { useEffect, useState, useCallback } from 'react';

export const useGetMyEventsInOrganization = (
  organizationId: string,
  eventUserId: string,
  eventUser: boolean = false
) => {
  const [eventsFreeToOneOreUse, setEventsFreeToOneOreUse] = useState<any[]>([]);
  const [isLoadingEventsFreeToOneOreUs, setIsLoading] = useState(true);
  const [eventsWithEventUser, setEventsWithEventUser] = useState<any[]>([]);
  const getEventsFreeAcces = useCallback(async (): Promise<any[]> => {
    try {
      const free_events = await OrganizationApi.getEventsInGroups(organizationId, true);

      return Array.isArray(free_events) ? free_events : [];
    } catch (error) {
      return [];
    }
  }, [organizationId]);

  const getEventWithOrgUser = useCallback(async () => {
    try {
      const { data } = await OrganizationApi.getEventsWithUserOrg(organizationId, eventUserId, eventUser, 'desc');
      const eventsFromOrgByUser = data.map((item: any) => item.event);
      setEventsWithEventUser(eventsFromOrgByUser);
      return eventsFromOrgByUser;
    } catch (error) {
      setEventsWithEventUser([]);
      return [];
    }
  }, [organizationId, eventUserId, eventUser]);

  const filterEventsFreeAccesToOrgUser = (eventsFreeAcces: any[], eventsWithEventUser: any[]) => {
    const eventsFreeFilter = eventsFreeAcces.filter(
      (eventFree) => !eventsWithEventUser.map((eventOfUser) => eventOfUser._id).includes(eventFree._id)
    );
    return eventsFreeFilter;
  };

  const fetchEventsFree = useCallback(async () => {
    try {
      setIsLoading(true);
      const free_events = await getEventsFreeAcces();
      const eventsFreeToOrgUser = await getEventWithOrgUser();
      const eventsFreeFilteredByorgUser = filterEventsFreeAccesToOrgUser(free_events, eventsFreeToOrgUser);
      setEventsFreeToOneOreUse(eventsFreeFilteredByorgUser);
    } catch (error) {
      setEventsFreeToOneOreUse([]);
    } finally {
      setIsLoading(false);
    }
  }, [getEventsFreeAcces, getEventWithOrgUser]);

  useEffect(() => {
    fetchEventsFree();
  }, [fetchEventsFree]);

  return {
    eventsFreeToOneOreUse,
    isLoadingEventsFreeToOneOreUs,
    getEventsFreeAcces,
    eventsWithEventUser,
    fetchEventsFree
  };
};
