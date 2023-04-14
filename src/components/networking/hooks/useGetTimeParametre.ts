import moment, { Moment } from 'moment'
import { useEffect, useState } from 'react'
import { TimeParameter } from '../interfaces/space-requesting.interface'
import { getConfig } from '../services/configuration.service'
import { networkingGlobalConfig } from '../interfaces/Index.interfaces'


const useGetTimeParameter = (EventId : string) => {
    const [timeParametres, setTimeParametres] = useState<TimeParameter>({
        meetingDuration: 20,
        hourStartSpaces: moment('00:00 am', 'h:mm a'),
        hourFinishSpaces: moment('11:59 pm', 'h:mm a'),
    })
    const [timeParametreLoading, setTimeParametreLoading] = useState(true)

    const loadConfig = async() => {
        const config = await getConfig<networkingGlobalConfig>(EventId)
        if(config?.ConfigTime){
            const {hourFinishSpaces,hourStartSpaces,meetingDuration} = config.ConfigTime
            setTimeParametres({
                meetingDuration: meetingDuration,
                hourStartSpaces: moment(hourStartSpaces, 'h:mm a'),
                hourFinishSpaces: moment(hourFinishSpaces, 'h:mm a'),
            })
        } else {
            setTimeParametres({
                meetingDuration: 20,
                hourStartSpaces: moment('2:30 am', 'h:mm a'),
                hourFinishSpaces: moment('11:59 pm', 'h:mm a'),
            })
        }
        setTimeParametreLoading(false)
    }

    useEffect(() => {
        loadConfig()
    }, [])

    return {
        timeParametres,
        timeParametreLoading,
    }
}

export default useGetTimeParameter