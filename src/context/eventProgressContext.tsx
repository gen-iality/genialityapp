import { ExtendedAgendaType } from '@Utilities/types/AgendaType'
import { FB } from '@helpers/firestore-request'
import { AgendaApi } from '@helpers/request'
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

type AttendeeType = any

export interface EventProgressContextState {
  activities: ExtendedAgendaType[]
  checkedInActivities: AttendeeType[]
  isLoading: boolean
  progressAllActivities: number
  progressWithoutQuices: number
  progressWithoutAnySurveys: number
  progressWithAnySurveys: number
  progressWithQuices: number
  updateActivities: () => Promise<ExtendedAgendaType[]>
  updateAttendees: () => Promise<void>
  getAttendeesForActivities: (activityIds: string[]) => AttendeeType[]
}

const initialContextState: EventProgressContextState = {
  activities: [],
  checkedInActivities: [],
  isLoading: false,
  progressAllActivities: 0,
  progressWithoutQuices: 0,
  progressWithoutAnySurveys: 0,
  progressWithAnySurveys: 0,
  progressWithQuices: 0,
  updateActivities: () => Promise.resolve([]),
  updateAttendees: () => Promise.resolve(),
  getAttendeesForActivities: () => [],
} as EventProgressContextState

const EventProgressContext = createContext<EventProgressContextState | undefined>(
  initialContextState,
)

export default EventProgressContext

export const EventProgressProvider: FunctionComponent = (props) => {
  const { children } = props

  const cEventContext = useEventContext()
  const cEventUser = useUserEvent()

  const [isLoading, setIsLoading] = useState(false)
  const [activities, setActivities] = useState<ExtendedAgendaType[]>([])
  const [checkedInActivities, setCheckedInActivities] = useState<AttendeeType[]>([])

  const updateActivities = async () => {
    // Request for all the event activities
    const { data }: { data: ExtendedAgendaType[] } = await AgendaApi.byEvent(
      cEventContext.value._id,
    )
    console.log(`Update activities. Got ${data.length} activities`)

    const filteredData = data.filter((activity) => !activity.is_info_only)
    setActivities(filteredData)

    return filteredData
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
      // NOTE: Can be implemented of checking of .checkIn, but for now, we
      // only check if exists
      return attendee !== undefined
    })

    setCheckedInActivities(checkedInOnes)
    console.log(`Got ${checkedInOnes.length} attendees`)
  }

  const anySurveyFilter = (a: ExtendedAgendaType) =>
    [activityContentValues.quizing, activityContentValues.survey].includes(
      a.type?.name as any,
    )

  const nonAnySurveyFilter = (a: ExtendedAgendaType) => !anySurveyFilter(a)

  const quizingFilter = (a: ExtendedAgendaType) =>
    [activityContentValues.quizing].includes(a.type?.name as any)

  const nonQuizingFilter = (a: ExtendedAgendaType) => !quizingFilter(a)

  const getAttendeesForActivities = useCallback(
    (activityIds: string[]): AttendeeType[] => {
      return checkedInActivities.filter((attendee) =>
        activityIds.includes(attendee.activityId),
      )
    },
    [checkedInActivities],
  )

  const calcProgress = (current: number, total: number) => {
    if (current === 0 || total === 0) return 0
    return Math.round((current / total) * 100)
  }

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

  const progressAllActivities = useMemo(
    () => calcProgress(checkedInActivities.length, activities.length),
    [activities, checkedInActivities],
  )

  const progressWithoutAnySurveys = useMemo(
    () => calcProgressApplyingFilter(nonAnySurveyFilter),
    [activities, checkedInActivities],
  )

  const progressWithAnySurveys = useMemo(
    () => calcProgressApplyingFilter(anySurveyFilter),
    [activities, checkedInActivities],
  )

  const progressWithoutQuices = useMemo(
    () => calcProgressApplyingFilter(nonQuizingFilter),
    [activities, checkedInActivities],
  )

  const progressWithQuices = useMemo(
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

  return (
    <EventProgressContext.Provider
      value={{
        activities,
        checkedInActivities,
        isLoading,
        updateActivities,
        updateAttendees,
        getAttendeesForActivities,
        progressAllActivities,
        progressWithoutQuices,
        progressWithoutAnySurveys,
        progressWithAnySurveys,
        progressWithQuices,
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
