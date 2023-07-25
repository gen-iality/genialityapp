import { ExtendedAgendaType } from '@Utilities/types/AgendaType'
// import { FB } from '@helpers/firestore-request'
// import { AgendaApi } from '@helpers/request'
import { useEffect } from 'react'
import { useState } from 'react'
import { FunctionComponent } from 'react'

interface IWrappedProps {
  isLoading?: boolean
  activities: ExtendedAgendaType[]
  checkedInActivities: any[]
  reload: (forceRefresh?: boolean) => Promise<void>
}

interface IEventProgressWrapperProps {
  event?: any
  eventUser?: any
  render: (renderProps: IWrappedProps) => JSX.Element
}

export const calcProgress = (current: number, total: number) => {
  if (current === 0 || total === 0) return 0
  const percent = Math.round((Math.min(current, total) / Math.max(total, current)) * 100)
  if (current > total) {
    console.error(`The parts cannot be greater than the whole (total), got: ${percent}%`)
  }
  return percent
}

const EventProgressWrapper: FunctionComponent<IEventProgressWrapperProps> = (props) => {
  const { event, eventUser, render } = props

  const [isLoading, setIsLoading] = useState(false)
  const [activities, setActivities] = useState<ExtendedAgendaType[]>([])
  const [checkedInActivities, setCheckedInActivities] = useState<any[]>([])

  const reload = async () => {
    const { activities, checked_in_activities } = eventUser.activity_progresses ?? {}
    setActivities(activities || [])
    setCheckedInActivities(checked_in_activities || [])
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
