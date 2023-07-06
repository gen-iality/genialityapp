import { ExtendedAgendaType } from '@Utilities/types/AgendaType'
import { FB } from '@helpers/firestore-request'
import { AgendaApi, UsersApi } from '@helpers/request'
import {
  createContext,
  useContext,
  FunctionComponent,
  useState,
  useEffect,
  useMemo,
  useCallback,
} from 'react'
import { useEventContext } from './eventContext'
import { useUserEvent } from './eventUserContext'
import { activityContentValues } from './activityType/constants/ui'
import { calcProgress } from '@/wrappers/EventProgressWrapper'

type AttendeeType = any

export interface EventProgressContextState {
  activities: ExtendedAgendaType[]
  filteredActivities: ExtendedAgendaType[]
  checkedInActivities: AttendeeType[]
  isLoading: boolean
  progressAllActivities: number
  progressFilteredActivities: number
  progressOfQuices: number
  updateActivities: () => Promise<ExtendedAgendaType[]>
  updateAttendees: () => Promise<void>
  getAttendeesForActivities: (activityIds: string[]) => AttendeeType[]
  calcProgress: (current: number, total: number) => number
  saveProgressReport: () => Promise<void>
}

const initialContextState: EventProgressContextState = {
  activities: [],
  filteredActivities: [],
  checkedInActivities: [],
  isLoading: false,
  progressAllActivities: 0,
  progressFilteredActivities: 0,
  progressOfQuices: 0,
  updateActivities: () => Promise.resolve([]),
  updateAttendees: () => Promise.resolve(),
  getAttendeesForActivities: () => [],
  calcProgress: () => 0,
  saveProgressReport: () => Promise.resolve(),
}

const EventProgressContext = createContext<EventProgressContextState>(initialContextState)

export default EventProgressContext

export const EventProgressProvider: FunctionComponent = (props) => {
  const { children } = props

  const cEventContext = useEventContext()
  const cEventUser = useUserEvent()

  const [isLoading, setIsLoading] = useState(false)
  const [activities, setActivities] = useState<ExtendedAgendaType[]>([])
  const [filteredActivities, setFilteredActivities] = useState<ExtendedAgendaType[]>([])
  const [checkedInActivities, setCheckedInActivities] = useState<AttendeeType[]>([])

  const updateActivities = async () => {
    // Request for all the event activities
    const { data }: { data: ExtendedAgendaType[] } = await AgendaApi.byEvent(
      cEventContext.value._id,
    )
    console.log(`Update activities. Got ${data.length} activities`)

    setActivities(data)

    return data
  }

  const updateAttendees = async (theseActivities?: ExtendedAgendaType[]) => {
    const filteredData = theseActivities || activities
    console.log(`Update attendees for ${filteredData.length} activities`)

    // Request for the attendee data in Firebase for all the activities
    const allAttendees = await FB.Attendees.getEventUserActivities(
      filteredData.map((activity) => activity._id as string),
      cEventUser.value._id,
      true,
    )

    const checkedInOnes = allAttendees.filter((attendee) => {
      if (attendee === undefined) return false
      return attendee.checked_in
    })

    setCheckedInActivities(checkedInOnes)
    console.log(`Got ${checkedInOnes.length} attendees`)
  }

  const quizingFilter = (a: ExtendedAgendaType) =>
    [activityContentValues.quizing].includes(a.type?.name as any)

  const getAttendeesForActivities = useCallback(
    (activityIds: string[]): AttendeeType[] => {
      return checkedInActivities.filter((attendee) =>
        activityIds.includes(attendee.activityId),
      )
    },
    [checkedInActivities],
  )

  const calcProgressApplyingFilter = (
    filter: (a: ExtendedAgendaType) => boolean,
  ): number => {
    const wantedActivityIds = activities
      .filter(filter)
      .map((activity) => activity._id as string)

    const filteredAttendees = getAttendeesForActivities(wantedActivityIds)

    // Calc the progress
    return calcProgress(filteredAttendees.length, wantedActivityIds.length)
  }

  const saveProgressReport = async () => {
    const eventUser = cEventUser.value
    eventUser.activity_progresses = {
      // ID list of activities
      activities: activities.map((activity) => activity._id!),
      filtered_activities: filteredActivities.map((activity) => activity._id!),
      checked_in_activities: checkedInActivities.map((attendee) => attendee._id!),
      // Calced progresses
      progress_all_activities: progressAllActivities,
      progress_filtered_activities: progressFilteredActivities,
      progress_of_quices: progressOfQuices,
    }
    // More injection of data
    eventUser.activity_progresses.viewed_activity_map = Object.fromEntries(
      eventUser.activity_progresses.activities.map((activityId: string) => [
        activityId,
        eventUser.activity_progresses.checked_in_activities.includes(activityId),
      ]),
    )
    console.debug('save new eventUser with progresses:', eventUser)
    await UsersApi.editEventUser(eventUser, cEventContext.value._id, eventUser._id)
  }

  const progressAllActivities = useMemo(
    () => calcProgress(checkedInActivities.length, activities.length),
    [activities, checkedInActivities],
  )

  const progressFilteredActivities = useMemo(
    () => calcProgress(checkedInActivities.length, filteredActivities.length),
    [filteredActivities, checkedInActivities],
  )

  const progressOfQuices = useMemo(
    () => calcProgressApplyingFilter(quizingFilter),
    [activities, checkedInActivities],
  )

  useEffect(() => {
    if (!cEventContext || !cEventContext.value) return
    if (!cEventUser || !cEventUser.value) return

    setIsLoading(true)
    updateActivities()
      .then((activities) => updateAttendees(activities))
      .finally(() => setIsLoading(false))
  }, [cEventContext.value, cEventUser.value])

  /**
   * We need take activities according of the event configuration:
   *
   * if it includes surveys, quiz ssurveys, info sections, etc...
   */
  useEffect(() => {
    if (!cEventContext.value) return
    const { progress_settings = {} } = cEventContext.value
    const { enable_mode }: { enable_mode?: string[] } = progress_settings

    if (enable_mode) {
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

      setFilteredActivities(newFilteredActivities)
      console.info(
        'event progress filters:',
        'info section =',
        ignoreInfoSection,
        'by type=',
        !!byTypeFilter,
        'rest=',
        ignoreRest,
      )
    } else {
      // Filter all
      const newFilteredActivities = activities.filter(() => true)
      setFilteredActivities(newFilteredActivities)
      console.info('event progress filters all activity')
    }
  }, [activities, cEventContext.value])

  return (
    <EventProgressContext.Provider
      value={{
        activities,
        filteredActivities,
        checkedInActivities,
        isLoading,
        updateActivities,
        updateAttendees,
        getAttendeesForActivities,
        progressAllActivities,
        progressFilteredActivities,
        progressOfQuices,
        calcProgress,
        saveProgressReport,
      }}
    >
      {children}
    </EventProgressContext.Provider>
  )
}

export function useEventProgress() {
  const context = useContext(EventProgressContext)
  if (!context) {
    throw new Error('useEventProgress must be into a provider')
  }

  return context
}
