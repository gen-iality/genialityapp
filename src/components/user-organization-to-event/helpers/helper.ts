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