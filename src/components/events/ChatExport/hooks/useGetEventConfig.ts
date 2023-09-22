import { useEffect, useState } from 'react'
import { getEventConfigChat } from '@/components/games/bingo/services'
import { IConfigChat } from '../interface/message.interface'


const useGetEventConfig = (eventId: string) => {
    const [eventConfigChat, seteventConfigChat] = useState<IConfigChat>()
    const [isLoading, setisLoading] = useState(true)

    useEffect(() => {
        getEventConfigChat(eventId)
            .then((config) => {
                seteventConfigChat(config)
            }).finally(() => {
                setisLoading(false)
            })
    }, [eventId])


    return {
        eventConfigChat,
        isLoading
    }
}

export default useGetEventConfig