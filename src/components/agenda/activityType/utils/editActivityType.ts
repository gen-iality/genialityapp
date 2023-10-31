import { ExtendedAgendaType } from '@Utilities/types/AgendaType'
import { AgendaApi, TypesAgendaApi } from '@helpers/request'

/**
 * Edit the activity type of an activity and returns the new updated activity.
 *
 * @param eventId The event ID.
 * @param activityId The activity ID.
 * @param typeName The new activity type. This value must be valid
 * @returns the edited activity object
 */
const editActivityType = async (
  eventId: string,
  activityId: string,
  typeName: string,
) => {
  const createTypeActivityBody: any = { name: typeName }
  const activityTypeDocument = await TypesAgendaApi.create(
    eventId,
    createTypeActivityBody,
  )
  const agenda: ExtendedAgendaType = await AgendaApi.editOne(
    { type_id: activityTypeDocument._id },
    activityId,
    eventId,
  )
  console.debug('editActivityType returns', agenda)
  return agenda
}

export default editActivityType
