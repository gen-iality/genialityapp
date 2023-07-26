import { activityContentValues } from '@context/activityType/constants/ui'
import { ExtendedAgendaType } from './types/AgendaType'

type ProgressSettingsType = {
  enable_mode?: string[]
}

export default function filterActivitiesByProgressSettings(
  activities: ExtendedAgendaType[],
  progressSettings: ProgressSettingsType,
): ExtendedAgendaType[] {
  const { enable_mode } = progressSettings
  if (!enable_mode) return activities

  // Filter by enable mode
  const ignoreInfoSection = enable_mode.includes('info')
  const ignoreRest = enable_mode.includes('rest')

  // Prepare the filter by type
  const byTypeFilter: string[] = []
  if (enable_mode.includes('survey')) {
    byTypeFilter.push(activityContentValues.survey)
  }
  if (enable_mode.includes('quiz')) {
    byTypeFilter.push(activityContentValues.quizing)
  }

  const newFilteredActivities = activities
    // Ignore info section
    .filter((activity) => !(activity.is_info_only && ignoreInfoSection))
    // Filter by event type
    .filter((activity) => !byTypeFilter.includes(activity.type?.name as any))
    // Filter the rest
    .filter(() => !ignoreRest)

  console.info(
    'event progress filters:',
    'info section =',
    ignoreInfoSection,
    'by type=',
    !!byTypeFilter,
    'rest=',
    ignoreRest,
  )
  return newFilteredActivities
}
