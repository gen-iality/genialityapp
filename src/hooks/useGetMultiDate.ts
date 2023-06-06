import { DateRangeEvius } from "@/components/events/hooks/useCustomDateEvent"
import { EventsApi } from "@/helpers/request"
import moment from "moment"
import { useEffect, useState } from "react"

export const useGetMultiDate = (eventId: string) => {
    const [multiDates, setmultiDates] = useState<DateRangeEvius[]>([])
    const [isLoading, setisLoading] = useState(true)


    const getDateStart = (format = 'll') => {
        if (multiDates[0]) {
            return moment(multiDates[0].start).format(format)
        } else {
            return 'No valid date'
        }
    }

    const getStartTime = (format = 'LT') => {
        if (multiDates[0]) {
            return moment(multiDates[0].start).format(format)
        } else {
            return 'No valid date'
        }
    }

    const getDateEnd = (format = 'll') => {
        if (multiDates[multiDates.length - 1]) {
            return moment(multiDates[multiDates.length - 1].end).format(format)
        } else {
            return 'No valid date'
        }
    }


    const getEndTime = (format = 'LT') => {
        if (multiDates[multiDates.length - 1]) {
            return moment(multiDates[multiDates.length - 1].end).format(format)
        } else {
            return 'No valid date'
        }
    }

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
        isLoading,
        getDateStart,
        getDateEnd,
        getStartTime,
        getEndTime
    }
}
