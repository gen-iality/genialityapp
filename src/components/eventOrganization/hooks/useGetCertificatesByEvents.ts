import  { useEffect, useState } from 'react'
import { Certificates } from '@/components/agenda/types'
import { CertsApi } from '@/helpers/request';


export const useGetCertificatesByEvents = (eventsWithEventUser:{ [key: string]: any }[]) => {
  const [certificatesByEvents, setcertificatesByEvents] = useState<Certificates[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const getCertificateByEventId = async (eventId: string, index:number) => {
    const CANTIDAD_DE_EVENTOS = eventsWithEventUser.length
    let certs: Certificates[] = await CertsApi.byEvent(eventId);
     if(certs &&  certs.length > 0) {
      setcertificatesByEvents([...certificatesByEvents,...certs])
     }
     if(index === CANTIDAD_DE_EVENTOS - 1){
      setIsLoading(false)
     }
  };

  useEffect(() => {
    eventsWithEventUser.forEach((event, index) => {
      getCertificateByEventId(event._id,index);
    });
  }, [eventsWithEventUser]);

  return {
    certificatesByEvents,
    isLoading
  }
}
