import { useEffect, useState } from 'react';
import { Certificates } from '@/components/agenda/types';
import { CertsApi } from '@/helpers/request';
import { useGetEventsWithUser } from './useGetEventsWithUser';
import { haveUserCertificate } from '../utils/certificates.utils';

export interface CertificatesByEvent {
  event: { [key: string]: any };
  certificatesByEvents: Certificates[];
  eventUser: any;
  userOrgId?: string;
}

export const useGetCertificatesByEvents = (organizationId: string, eventUserId: string, userOrgId: string) => {
  const { eventsWithEventUser, eventUsers, isLoading: isLoadingEvents } = useGetEventsWithUser(
    organizationId,
    eventUserId,
    true,
    userOrgId
  );
  const [certificatesByEvents, setCertificatesByEvents] = useState<CertificatesByEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);


  // Función asíncrona para obtener certificados por ID de evento y aplicar filtros necesarios.
  const getCertificateByEventId = async (event: { [key: string]: any }): Promise<CertificatesByEvent> => {
    try {
      const certs: Certificates[] = await CertsApi.byEvent(event._id);
      const eventUserCurrent = eventUsers.find((eventUser) => eventUser.event_id === event._id);

      const newCertificates = certs.filter(cert => haveUserCertificate(cert, (eventUserCurrent?.properties as any).list_type_user));

      return {
        event,
        certificatesByEvents: newCertificates,
        eventUser: eventUserCurrent,
      };
    } catch (error) {
      console.error("Error fetching certificates for event:", event._id, error);
      return { event, certificatesByEvents: [], eventUser: undefined };
    }
  };

  // Función para obtener los datos de los certificados y filtrar eventos sin certificados.
  const getData = async () => {
    setIsLoading(true);
    try {
      const certificatesPromises = eventsWithEventUser.map(getCertificateByEventId);
      const certificatesResults = await Promise.all(certificatesPromises);
      const filteredCertificates = certificatesResults.filter(({ certificatesByEvents }) => certificatesByEvents.length > 0);

      setCertificatesByEvents(filteredCertificates);
    } catch (error) {
      console.error("Error processing certificates data:", error);
      setCertificatesByEvents([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Efecto para obtener datos de certificados una vez que los eventos estén cargados y no estén cargando.
  useEffect(() => {
    if (!isLoadingEvents) {
      getData();
    }
  }, [isLoadingEvents, eventsWithEventUser, eventUsers]);

  return {
    certificatesByEvents,
    isLoading,
    eventsWithEventUser,
    eventUsers,
  };
};
