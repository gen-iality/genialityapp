import  { useEffect, useState } from 'react'
import { Certificates } from '@/components/agenda/types'
import { CertsApi } from '@/helpers/request';
import { useGetEventsWithUser } from './useGetEventsWithUser';



export const useGetCertificatesByEvents = (organizationId:string, eventUserId:string) => {

  const { eventsWithEventUser, eventUsers, isLoading:isLoadingEvents} = useGetEventsWithUser(
    organizationId,
    eventUserId,
    true
  );
  const [certificatesByEvents, setCertificatesByEvents] = useState<Certificates[]>([])
  const [isLoading, setIsLoading] = useState(true)


  const getCertificateByEventId = async (eventUser: { [key:string] :any }) => {
    let certs: Certificates[] = await CertsApi.byEvent(eventUser.event_id);
   
     if(certs &&  certs.length > 0) {
      const newCertificates: Certificates[] = certs.filter( cert=>{

        if(!cert.userTypes || cert.userTypes.length === 0){
          return true
        }
        return cert.userTypes?.includes(eventUser.properties.list_type_user)

      })
      return newCertificates
    }

      return []
   
  };

  const getData= async ()=>{
    const newCertificates:Promise<Certificates[]>[]=[]

    eventUsers.forEach( (eventUser, index) => {
      newCertificates.push(getCertificateByEventId(eventUser));
    });
    try {
      const certificatesByEvent = await Promise.all(newCertificates)

      const resultado = ([] as Certificates[]).concat.apply([], certificatesByEvent);
  
      setCertificatesByEvents(resultado)
    
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
