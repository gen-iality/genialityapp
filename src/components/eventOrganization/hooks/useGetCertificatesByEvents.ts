import  { useEffect, useState } from 'react'
import { Certificates } from '@/components/agenda/types'
import { CertsApi } from '@/helpers/request';
import { useGetEventsWithUser } from './useGetEventsWithUser';

export interface CertificatesByEvent {
  event:{ [key:string] :any };
  certificatesByEvents: Certificates[],
  eventUser: any
}

export const useGetCertificatesByEvents = (organizationId:string, eventUserId:string) => {

  const { eventsWithEventUser, eventUsers, isLoading:isLoadingEvents} = useGetEventsWithUser(
    organizationId,
    eventUserId,
    true
  );
  const [certificatesByEvents, setCertificatesByEvents] = useState<CertificatesByEvent[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const getCertificateByEventId = async (event: { [key:string] :any }):Promise<CertificatesByEvent> => {
    try {
      let certs: Certificates[] = await CertsApi.byEvent(event._id);
      /* console.log(eventUser.event_id,{
        id:eventUser,
        certs
      } ) */
      if(certs &&  certs.length > 0) {
        const eventUserCurrent = eventUsers.find((eventUser)=>eventUser.event_id === event._id)

        const newCertificates: Certificates[] = certs.filter( cert=>{
          if(!cert.userTypes || cert.userTypes.length === 0){
            return true
          }
          return cert.userTypes?.includes(eventUserCurrent.properties.list_type_user)
  
        })

        return {
          event,
          certificatesByEvents: newCertificates,
          eventUser:eventUserCurrent
        }
      }
      return {
        event,
        certificatesByEvents: [],
        eventUser:undefined
      }
      } catch (error) {
      return {
        event,
        certificatesByEvents: [],
        eventUser:undefined
      }
    }
   
  };

  const getData= async ()=>{
    const newCertificates:Promise<CertificatesByEvent>[]=[]

    eventsWithEventUser.forEach( (event) => {
      newCertificates.push(getCertificateByEventId(event));
    });
    try {
      const certificatesByEvent = await Promise.all(newCertificates)

      const newCertificatesByEvent = certificatesByEvent.filter(certificateByEvent=>certificateByEvent.certificatesByEvents.length > 0)

      setCertificatesByEvents(newCertificatesByEvent)
    
      setIsLoading(false)
    } catch (error) {

      setIsLoading(false)
      setCertificatesByEvents([])


    }
   
  }

  useEffect(() => {
    if(!isLoadingEvents){
      getData()
    }
  }, [isLoadingEvents]);

  return {
    certificatesByEvents,
    isLoading,
    eventsWithEventUser,
    eventUsers
  }
}
