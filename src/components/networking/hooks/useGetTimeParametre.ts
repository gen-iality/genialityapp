import moment, { Moment } from 'moment'
import { useEffect, useState } from 'react'
import { TimeParameter } from '../interfaces/space-requesting.interface'


const useGetTimeParameter = () => {
    const [timeParametres, setTimeParametres] = useState<TimeParameter>({
        meetingDuration: 20,
        hourStartSpaces: moment('00:00 am', 'h:mm a'),
        hourFinishSpaces: moment('11:59 pm', 'h:mm a'),
    })
    const [timeParametreLoading, setTimeParametreLoading] = useState(true)


    useEffect(() => {
        setTimeParametres({
            meetingDuration: 20,
            hourStartSpaces: moment('2:30 am', 'h:mm a'),
            hourFinishSpaces: moment('4:30 am', 'h:mm a'),
        })
        setTimeParametreLoading(false)
    }, [])

    return {
        timeParametres,
        timeParametreLoading,
    }
}

export default useGetTimeParameter