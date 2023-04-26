import { StatusSpace } from "@/components/networking/interfaces/space-requesting.interface";

export const getAccionButton = (status: StatusSpace) => {
    if (status === 'avalible') return 'Agendar';
    if (status === 'not_available') return 'No disponible';
    if (status === 'requested') return 'Solicitado';
    if (status === 'rejected') return 'Rechazado';
    if (status === 'accepted') return 'Aceptado';
    if (status === 'canceled') return 'Cancelado';
    if (status === 'busy-schedule') return 'Agenda Ocupada';
};

export const getDisabledAccionButton = (status: StatusSpace) => {
    if (
        status === 'not_available' ||
        status === 'requested' ||
        status === 'rejected' ||
        status === 'accepted' ||
        status === 'canceled' ||
        status === 'busy-schedule'
    )
        return true;
    return false;
};