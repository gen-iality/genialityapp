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
import filterActivitiesByProgressSettings from '@Utilities/filterActivitiesByProgressSettings'

type AttendeeType = any

export interface EventProgressContextState {
  rawActivities: ExtendedAgendaType[]
  filteredActivities: ExtendedAgendaType[]
  checkedInRawActivities: AttendeeType[]
  checkedInFilteredActivities: AttendeeType[]
  nonPublishedActivityIDs: string[]
  isLoading: boolean
  progressRawActivities: number
  progressFilteredActivities: number
  progressOfQuices: number
  updateRawActivities: () => Promise<ExtendedAgendaType[]>
  updateRawAttendees: () => Promise<void>
  getAttendeesForActivities: (activityIds: string[]) => AttendeeType[]
  calcProgress: (current: number, total: number) => number
  saveProgressReport: () => Promise<void>
}

const initialContextState: EventProgressContextState = {
  rawActivities: [],
  filteredActivities: [],
  checkedInRawActivities: [],
  checkedInFilteredActivities: [],
  nonPublishedActivityIDs: [],
  isLoading: false,
  progressRawActivities: 0,
  progressFilteredActivities: 0,
  progressOfQuices: 0,
  updateRawActivities: () => Promise.resolve([]),
  updateRawAttendees: () => Promise.resolve(),
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
  const [rawActivities, setRawActivities] = useState<ExtendedAgendaType[]>([])
  const [checkedInRawActivities, setCheckedInRawActivities] = useState<AttendeeType[]>([])

  const [nonPublishedActivityIDs, setNonPublishedActivityIDs] = useState<string[]>([])

  const [filteredActivities, setFilteredActivities] = useState<ExtendedAgendaType[]>([])
  const [checkedInFilteredActivities, setCheckedInFilteredActivities] = useState<
    AttendeeType[]
  >([])

  const updateRawActivities = async () => {
    // Request for all the raw event activities
    const { data }: { data: ExtendedAgendaType[] } = await AgendaApi.byEvent(
      cEventContext.value._id,
    )
    console.debug(`Update raw activities. Got ${data.length} raw activities`)

    setRawActivities(data)

    return data
  }

  const updateRawAttendees = async (theseActivities?: ExtendedAgendaType[]) => {
    const filteredData =
      theseActivities ||
      rawActivities.filter((activity) => !nonPublishedActivityIDs.includes(activity._id!))
    console.debug(`Update attendees for ${filteredData.length} raw activities`)

    // Request for the attendee data in Firebase for all the raw activities
    const allAttendees = await FB.Attendees.getEventUserActivities(
      filteredData.map((nonFilteredActivity) => nonFilteredActivity._id as string),
      cEventUser.value?._id,
      true,
    )

    const checkedInOnes = allAttendees.filter((attendee) => {
      if (attendee === undefined) return false
      return attendee.checked_in
    })

    setCheckedInRawActivities(checkedInOnes)
    console.debug(`Got ${checkedInOnes.length} attendees`)
  }

  const updateFilteredAttendees = async (theseActivities?: ExtendedAgendaType[]) => {
    const filteredData =
      theseActivities ||
      filteredActivities.filter(
        (activity) => !nonPublishedActivityIDs.includes(activity._id!),
      )
    console.debug(`Update attendees for ${filteredData.length} activities`)

    // Request for the attendee data in Firebase for all the activities
    const allAttendees = await FB.Attendees.getEventUserActivities(
      filteredData.map((activity) => activity._id as string),
      cEventUser.value?._id,
      true,
    )

    const checkedInOnes = allAttendees.filter((attendee) => {
      if (attendee === undefined) return false
      return attendee.checked_in
    })

    setCheckedInFilteredActivities(checkedInOnes)
    console.debug(`Got ${checkedInOnes.length} attendees`)
  }

  const quizingFilter = (a: ExtendedAgendaType) =>
    [activityContentValues.quizing].includes(a.type?.name as any)

  const getAttendeesForActivities = useCallback(
    (activityIds: string[]): AttendeeType[] => {
      return checkedInRawActivities
        .filter((activity) => !nonPublishedActivityIDs.includes(activity._id!))
        .filter((attendee) => activityIds.includes(attendee.activityId))
    },
    [checkedInRawActivities],
  )

  const calcProgressApplyingFilter = (
    filter: (a: ExtendedAgendaType) => boolean,
  ): number => {
    const wantedActivityIds = rawActivities
      .filter((activity) => !nonPublishedActivityIDs.includes(activity._id!))
      .filter(filter)
      .map((activity) => activity._id as string)

    const filteredAttendees = getAttendeesForActivities(wantedActivityIds)

    // Calc the progress
    return calcProgress(filteredAttendees.length, wantedActivityIds.length)
  }

  const saveProgressReport = async () => {
    const eventUser = cEventUser.value
    const lastEventUser = { ...eventUser }
    if (!eventUser) {
      console.warn('call saveProgressReport when event user is defined ONLY')
      return
    }
    eventUser.activity_progresses = {
      // ID list of activities
      activities: rawActivities.map((activity) => activity._id!),
      filtered_activities: filteredActivities.map((activity) => activity._id!),
      checked_in_activities: checkedInRawActivities.map((attendee) => attendee._id!),
      // Calced progresses
      progress_all_activities: progressRawActivities,
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
    // Check if the new data is really new data
    if (
      JSON.stringify(lastEventUser.activity_progresses) ===
      JSON.stringify(eventUser.activity_progresses)
    )
      return
    console.debug('save new eventUser with progresses:', eventUser)
    await UsersApi.editEventUser(eventUser, cEventContext.value._id, eventUser._id)
  }

  const progressRawActivities = useMemo(
    () =>
      calcProgress(
        checkedInRawActivities.length,
        rawActivities.filter(
          (activity) => !nonPublishedActivityIDs.includes(activity._id!),
        ).length,
      ),
    [rawActivities, checkedInRawActivities],
  )

  const progressFilteredActivities = useMemo(
    () =>
      calcProgress(
        checkedInFilteredActivities.length,
        filteredActivities.filter(
          (activity) => !nonPublishedActivityIDs.includes(activity._id!),
        ).length,
      ),
    [filteredActivities, checkedInFilteredActivities],
  )

  const progressOfQuices = useMemo(
    () => calcProgressApplyingFilter(quizingFilter),
    [rawActivities, checkedInRawActivities],
  )

  /**
   * For each changes in Event & EventUser we request for:
   * - all non-filtered activities
   * - all non-filtered attendees
   *
   * Next we will use the non-filtered ones to calc the filtered values as:
   * - filtered activities (according of admin settings)
   * - filtered attendees (which depends of filtered activities)
   */
  useEffect(() => {
    if (!cEventContext || !cEventContext.value) return
    if (!cEventUser || !cEventUser.value) return

    setIsLoading(true)
    updateRawActivities()
      .then((activities) => updateRawAttendees(activities))
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

    setFilteredActivities(
      filterActivitiesByProgressSettings(rawActivities, progress_settings),
    )

    rawActivities.forEach((activity) => {
      FB.Activities.ref(cEventContext.value._id!, activity._id!).onSnapshot(
        (snapshot) => {
          const data = snapshot.data()
          if (!data) return
          const flag = !!data.isPublished

          if (!flag) {
            setNonPublishedActivityIDs((previous) => [...previous, activity._id!])
          } else {
            setNonPublishedActivityIDs((previous) =>
              previous.filter((id) => id !== activity._id!),
            )
          }
        },
      )
    })
  }, [rawActivities, cEventContext.value])

  useEffect(() => {
    updateFilteredAttendees()
  }, [filteredActivities])

  return (
    <EventProgressContext.Provider
      value={{
        rawActivities,
        filteredActivities,
        checkedInRawActivities,
        checkedInFilteredActivities,
        nonPublishedActivityIDs,
        isLoading,
        updateRawActivities,
        updateRawAttendees,
        getAttendeesForActivities,
        progressRawActivities,
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
