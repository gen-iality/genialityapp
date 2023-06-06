import { DateRangeEvius } from "@/components/events/hooks/useCustomDateEvent"
import { EventsApi } from "@/helpers/request"
import { useEffect, useState } from "react"

export const useGetMultiDate = (eventId: string) => {
    const [multiDates, setmultiDates] = useState<DateRangeEvius[]>([])
    const [isLoading, setisLoading] = useState(true)


    useEffect(() => {
        if (!eventId) return
        const getData = async () => {
            const data = await EventsApi.getOne(eventId);
            setmultiDates(data.dates as DateRangeEvius[])
            setisLoading(false)
        }
        getData()
    }, [eventId])

    return {
        multiDates,
        isLoading
    }
}
