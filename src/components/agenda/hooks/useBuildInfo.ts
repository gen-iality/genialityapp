import * as Moment from 'moment';
import AgendaDocumentType from '../types/AgendaDocumentType';
import { FormularyType } from '../components/AgendaFormulary';

export default function useBuildInfo (formulary: FormularyType, info: AgendaDocumentType) {
  const buildInfo = () => {
    const {
      name,
      hour_start,
      hour_end,
      date,
      space_id,
      selectedCategories,
      selectedHosts,
      selectedRol,
      selectedDocuments,
      description,
      image,
      length,
      latitude,
    } = formulary;

    const {
      meeting_id,
      selectedTicket,
      vimeo_id,
      platform,
      start_url,
      join_url,
      name_host,
      key,
      requires_registration,
      isPublished,
      registration_message,
      // selected_document,
      capacity,
      access_restriction_type,
      subtitle,
      bigmaker_meeting_id,
      has_date,
    } = info;

    // const registration_message_storage = window.sessionStorage.getItem('registration_message');
    // const description_storage = window.sessionStorage.getItem('description');
    /* console.log(date, '========================== date'); */
    const datetime_start = date + ' ' + Moment(hour_start).format('HH:mm');
    const datetime_end = date + ' ' + Moment(hour_end).format('HH:mm');

    const activity_categories_ids =
      selectedCategories !== undefined && selectedCategories !== null
        ? selectedCategories[0] === undefined
          ? []
          : selectedCategories.map(({ value }) => value)
        : [];

    const access_restriction_rol_ids = access_restriction_type !== 'OPEN' ? selectedRol.map(({ value }) => value) : [];
    const host_ids = selectedHosts.length >= 0 ? [] : selectedHosts?.filter((host) => host != null).map(({ value }) => value);
    return {
      name,
      subtitle,
      bigmaker_meeting_id,
      datetime_start,
      datetime_end,
      space_id,
      image,
      description,
      registration_message,
      capacity: parseInt(capacity.toString(), 10),
      activity_categories_ids,
      access_restriction_type,
      access_restriction_rol_ids,
      has_date,
      timeConference: '',
      // selected_document,
      meeting_id: meeting_id,
      vimeo_id: vimeo_id,
      selectedTicket,
      platform,
      start_url,
      join_url,
      name_host,
      key,
      requires_registration,
      isPublished,
      host_ids,
      length,
      latitude,
      selected_document: selectedDocuments,
    } as AgendaDocumentType;
  };

  return buildInfo;
}
