import { OrganizationApi } from '@/helpers/request'
import { useEffect, useState } from 'react'

export const useGetEventsWithUser = (organizationId: string, eventUserId: string) => {
    const [eventsWithEventUser, setEventsWithEventUser] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)

    const getUser = async () => {
        try {
            if (!eventUserId) {
                setIsLoading(false)
                return
            }
            const { events } = await OrganizationApi.getEventsWithUserOrg(organizationId, eventUserId)
            setEventsWithEventUser(events)
        } catch (error) {
            setEventsWithEventUser([])
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        getUser()
    }, [organizationId, eventUserId])

    return {
        eventsWithEventUser,
        isLoading
    }
}
