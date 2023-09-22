import { OrganizationApi } from '@/helpers/request'
import { useEffect, useState } from 'react'

export const useGetEventsWithUser = (organizationId: string, eventUserId: string, eventUser: boolean = false) => {
    const [eventsWithEventUser, setEventsWithEventUser] = useState<any[]>([])
    const [eventUsers, setEventUsers] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)

    const getEventFromOrganizationByUser = async () => {
        try {
            if (!eventUserId) {
                setEventsWithEventUser([])
                setIsLoading(false)
                return
            }
            const { data } = await OrganizationApi.getEventsWithUserOrg(organizationId, eventUserId, eventUser, 'latest')
            setEventsWithEventUser( data.map(( item: any )=> item.event ) )
            if(eventUser){
                setEventUsers( data.map(( item: any )=> item.event_user ) )
            }
        } catch (error) {
            setEventsWithEventUser([])
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        getEventFromOrganizationByUser()
    }, [organizationId, eventUserId,eventUser])

    return {
        eventsWithEventUser,
        isLoading,
        eventUsers
    }
}
