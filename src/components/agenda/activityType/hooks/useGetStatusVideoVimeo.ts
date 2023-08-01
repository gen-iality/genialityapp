import { AgendaApi } from '@/helpers/request'
import React, { useEffect, useState } from 'react'


export type Status = 'complete' | 'in_progress' | 'error'

export const useGetStatusVideoVimeo = (videoId?: string | null) => {
    const [statusVide, setStatusVide] = useState<Status>('in_progress')
    const [isLoading, setIsLoading] = useState(true)

    const getStatusVideo = async () => {
        if (!videoId) {
            setStatusVide('complete')
            setIsLoading(false)
            return 
        }
        try {
            const data = await AgendaApi.getStatusVideoVimeo(videoId)
            console.log('data', data.video.transcode.status)
            setStatusVide(data.video.transcode.status as Status)
        } catch (error) {
            return 'error'
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        getStatusVideo()
    }, [videoId])



    return { statusVide, isLoading }
}
