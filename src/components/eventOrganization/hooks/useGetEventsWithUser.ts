import { OrganizationApi, CertsApi } from '@/helpers/request';
import { useEffect, useState } from 'react';

interface Event {
  _id: string;
}

interface EventUser {
  _id: string;
  event_id: string;
  properties: object
}

interface CertificateEvent {
  event_id: string;
}

const certificatesByEvents = async (orgUserId: string) => {
  try {
    const data = await CertsApi.getByOrganizationUser(orgUserId);
    return {
      data,
      error: null,
    };
  } catch (error) {
    return {
      data: null,
      error,
    };
  }
};

export const useGetEventsWithUser = (organizationId: string, eventUserId: string, eventUser: boolean = false, userOrgId: string) => {
  const [eventsWithEventUser, setEventsWithEventUser] = useState<Event[]>([]);
  const [eventsWithCertificate, setEventsWithCertificate] = useState<CertificateEvent[]>([]);
  const [eventUsers, setEventUsers] = useState<EventUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const getEventsWithCertificate = async () => {
    try {
      const response = await certificatesByEvents(userOrgId);
      if (response.data) {
        setEventsWithCertificate(response.data);
      }
    } catch (error) {
      setEventsWithCertificate([]);
    }
  };

  const getEventFromOrganizationByUser = async () => {
    try {
      setIsLoading(true);
      if (!eventUserId) {
        setEventsWithEventUser([]);
        setEventUsers([]);
        setIsLoading(false);
        return;
      }
      const { data } = await OrganizationApi.getEventsWithUserOrg(organizationId, eventUserId, eventUser, 'desc');

      // Realizar filtrado y mapeo de los eventos con certificados del usuario en sesión
      const filteredEvents = data.filter((item: any) =>
        eventsWithCertificate.some(certEvent => certEvent.event_id === item.event._id)
      );
      
      setEventsWithEventUser(filteredEvents.map((item: any) => item.event));

      if (eventUser) {
        const filteredEventUsers = filteredEvents
          .filter((item: any) => item.event_user)
          .map((item: any) => item.event_user);
        setEventUsers(filteredEventUsers);
      }

    } catch (error) {
      setEventsWithEventUser([]);
      setEventUsers([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getEventsWithCertificate();
  }, [userOrgId]); 

  useEffect(() => {
    if (eventsWithCertificate.length > 0) {
      getEventFromOrganizationByUser();
    }
  }, [organizationId, eventUserId, eventUser, eventsWithCertificate]);
  return {
    eventsWithEventUser,
    eventUsers,
    isLoading,
  };
};
