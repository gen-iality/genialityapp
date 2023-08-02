import { AgendaApi } from "@/helpers/request"

export const downloadVideoById = async (videoId: string | null | undefined) => {
    if (!videoId) return
    const data = await AgendaApi.getStatusVideoVimeo(videoId)
    console.log('data', data)
}