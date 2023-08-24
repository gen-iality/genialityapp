import { UsersApi } from '@/helpers/request'
import  { useEffect, useState } from 'react'



export const useGetEventUserByEvent = (eventId:string) => {
    const [eventUsersByEvent, setEventUsersByEvent] = useState<any[]>([])
    const [isLoading, setisLoading] = useState(true)
    
    const getData = async() =>{
        try {
            const {data} = await UsersApi.getAll(eventId)
            setEventUsersByEvent(data as any[])
        } catch (error) {
            setEventUsersByEvent([])
            setisLoading(false)
        }
    }
    
    useEffect(() => {
        getData()
    }, [])

    return {
        eventUsersByEvent,
        isLoading
    }
}
