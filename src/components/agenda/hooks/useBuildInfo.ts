import dayjs from 'dayjs'
import AgendaType from '@Utilities/types/AgendaType'
import { FormDataType } from '../components/MainAgendaForm'

export default function useBuildInfo(
  formdata: FormDataType,
  agenda: AgendaType | null,
  defaultAgenda: AgendaType,
) {
  const buildInfo: () => AgendaType = () => {
    const {
      name,
      hour_start,
      hour_end,
      date,
      space_id,
      selectedCategories,
      selectedHosts,
      selectedTools,
      selectedRol,
      selectedDocuments,
      description,
      image,
      length,
      latitude,
      module_id,
    } = formdata

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
      registration_message,
      // selected_document,
      capacity,
      access_restriction_type,
      subtitle,
      bigmaker_meeting_id,
      has_date,
    } = agenda || defaultAgenda

    const datetime_start = date + ' ' + dayjs(hour_start).format('HH:mm')
    const datetime_end = date + ' ' + dayjs(hour_end).format('HH:mm')

    const activity_categories_ids =
      selectedCategories !== undefined && selectedCategories !== null
        ? selectedCategories[0] === undefined
          ? []
          : selectedCategories.map(({ value }) => value)
        : []

    const access_restriction_rol_ids =
      access_restriction_type !== 'OPEN' ? selectedRol.map(({ value }) => value) : []
    const host_ids = selectedHosts
      .filter((host) => host !== null)
      .map(({ value }) => value)
    const tool_ids = selectedTools
      .filter((tool) => tool !== null)
      .map(({ value }) => value)

    return {
      name,
      module_id,
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
      host_ids,
      tool_ids,
      length,
      latitude,
      selected_document: selectedDocuments,
    }
  }

  return buildInfo
}
