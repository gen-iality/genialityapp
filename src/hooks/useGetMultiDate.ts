import { DateRangeEvius } from "@/components/events/hooks/useCustomDateEvent"
import { UseEventContext } from "@/context/eventContext"
import { EventsApi } from "@/helpers/request"
import moment from "moment"
import { useEffect, useState } from "react"

export const useGetMultiDate = (eventId: string) => {
    const [multiDates, setmultiDates] = useState<DateRangeEvius[]>([])
    const [isLoading, setisLoading] = useState(true)
    const cEventValues = UseEventContext().value;
    const getDateStart = (format = 'll') => {
        if (multiDates[0]) {
            return moment(multiDates[0].start).format(format)
        } else {
            return moment(cEventValues?.datetime_from).format(format)
        }
    }

    const getStartTime = (format = 'LT') => {
        if (multiDates[0]) {
            return moment(multiDates[0].start).format(format)
        } else {
            return moment(cEventValues?.datetime_from).format('LT')
        }
    }

    const getDateEnd = (format = 'll') => {
        if (multiDates[multiDates.length - 1]) {
            return moment(multiDates[multiDates.length - 1].end).format(format)
        } else {
            return moment(cEventValues?.datetime_to).format('ll')
        }
    }


    const getEndTime = (format = 'LT') => {
        if (multiDates[multiDates.length - 1]) {
            return moment(multiDates[multiDates.length - 1].end).format(format)
        } else {
            return moment(cEventValues?.datetime_to).format('LT')
        }
    }

    useEffect(() => {
        if (!eventId) return
        const getData = async () => {
            const data = await EventsApi.getOne(eventId);
            setmultiDates(data.dates ?? [] as DateRangeEvius[])
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
