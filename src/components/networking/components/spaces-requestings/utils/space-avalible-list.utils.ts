import { StatusSpace } from "@/components/networking/interfaces/space-requesting.interface";
import { useIntl } from "react-intl";

export const getAccionButton = (status: StatusSpace) => {
    const intl = useIntl();
    if (status === 'avalible') return intl.formatMessage({id: 'networking_schedule', defaultMessage: 'Agendar'});
    if (status === 'not_available') return intl.formatMessage({id: 'networking_not_available', defaultMessage: 'No disponible'});
    if (status === 'requested') return intl.formatMessage({id: 'networking_required', defaultMessage: 'Solicitado'});
    if (status === 'rejected') return intl.formatMessage({id: 'networking_refused', defaultMessage: 'Rechazado'});
    if (status === 'accepted') return intl.formatMessage({id: 'networking_accepted', defaultMessage: 'Aceptado'});
    if (status === 'canceled') return intl.formatMessage({id: 'networking_cancelled', defaultMessage: 'Cancelado'});
    if (status === 'busy-schedule') return intl.formatMessage({id: 'networking_busy_schedule', defaultMessage: 'Agenda ocupada'});
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