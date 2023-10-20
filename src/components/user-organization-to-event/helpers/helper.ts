import { UsersApi } from "@/helpers/request";
import { UserOrganizationToEvent } from "../interface/table-user-oranization-to-event";

export const createEventUserFromUserOrganization = (userOrganization: UserOrganizationToEvent) => {
    console.log('Creadno', userOrganization.name)
}

export const existsEventUser = async (eventId: string, userId: string): Promise<boolean> => {
    try {
        await UsersApi.getOne(eventId, userId)
        return true
    } catch (error) {
        return false
    }
}

export const isOrganizationCETA = () => {
    const pathname = window.location.pathname
    return pathname.includes('64b7f26a920809c56a0e6e52') || pathname.includes('653047d0b2b1aee7e00b57e2')
}