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
} from 'react'
import { useEventContext } from './eventContext'
import { useUserEvent } from './eventUserContext'
import { activityContentValues } from './activityType/constants/ui'

export interface EventProgressContextState {
  activities: ExtendedAgendaType[]
  checkedInActivities: any[]
  isLoading: boolean
  progressWithoutQuices: number
  progressWithoutAnySurveys: number
  updateActivities: () => Promise<ExtendedAgendaType[]>
  updateAttendees: () => Promise<void>
}

const initialContextState: EventProgressContextState = {
  activities: [],
  checkedInActivities: [],
  isLoading: false,
  progressWithoutQuices: 0,
  progressWithoutAnySurveys: 0,
  updateActivities: () => Promise.resolve([]),
  updateAttendees: () => Promise.resolve(),
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
  const [checkedInActivities, setCheckedInActivities] = useState<any[]>([])

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
    ![activityContentValues.quizing, activityContentValues.survey].includes(
      a.type?.name as any,
    )

  const quizingFilter = (a: ExtendedAgendaType) =>
    ![activityContentValues.quizing].includes(a.type?.name as any)

  const calcProgress = (current: number, total: number) => {
    if (current === 0 || total === 0) return 0
    return Math.round((current / total) * 100)
  }

  const calcProgressApplyingFilter = (
    filter: (a: ExtendedAgendaType) => boolean,
  ): number => {
    const UnwantedActivities = activities.filter(filter)
    const UnwantedActivityIds = UnwantedActivities.map(
      (activity) => activity._id as string,
    )

    const filteredAttendees = checkedInActivities.filter(
      (attendee) => !UnwantedActivityIds.includes(attendee.activity_id),
    )

    // Calc the progress
    return calcProgress(filteredAttendees.length, UnwantedActivities.length)
  }

  const progressWithoutAnySurveys = useMemo(
    () => calcProgressApplyingFilter(anySurveyFilter),
    [activities, checkedInActivities],
  )

  const progressWithoutQuices = useMemo(
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
        progressWithoutQuices,
        progressWithoutAnySurveys,
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
