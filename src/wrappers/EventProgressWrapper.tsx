import { ExtendedAgendaType } from '@Utilities/types/AgendaType'
import { FB } from '@helpers/firestore-request'
import { AgendaApi } from '@helpers/request'
import { useEffect } from 'react'
import { useState } from 'react'
import { FunctionComponent } from 'react'

interface IWrappedProps {
  isLoading?: boolean
  activities: ExtendedAgendaType[]
  checkedInActivities: any[]
  reload: () => Promise<void>
}

interface IEventProgressWrapperProps {
  event?: any
  eventUser?: any
  render: (renderProps: IWrappedProps) => JSX.Element
}

export const calcProgress = (current: number, total: number) => {
  if (current > total) {
    throw new Error('The parts cannot be greater than the whole (total), flaco')
  }
  if (current === 0 || total === 0) return 0
  return Math.round((current / total) * 100)
}

const EventProgressWrapper: FunctionComponent<IEventProgressWrapperProps> = (props) => {
  const { event, eventUser, render } = props

  const [isLoading, setIsLoading] = useState(false)
  const [activities, setActivities] = useState<ExtendedAgendaType[]>([])
  const [checkedInActivities, setCheckedInActivities] = useState<any[]>([])

  const updateActivities = async () => {
    // Request for all the event activities
    const { data }: { data: ExtendedAgendaType[] } = await AgendaApi.byEvent(event._id)
    console.log(`Update activities. Got ${data.length} activities`)

    // TODO: This filter by whether the activity is info, should be after
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
      eventUser._id,
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

  const reload = async () => {
    const activities = await updateActivities()
    await updateAttendees(activities)
  }

  useEffect(() => {
    if (!event) return
    if (!eventUser) return

    setIsLoading(true)
    reload().finally(() => setIsLoading(false))
  }, [event, eventUser])

  return render({
    isLoading,
    activities,
    checkedInActivities,
    reload,
  })
}

export default EventProgressWrapper
