import { FB } from '@helpers/firestore-request'
import { useEffect } from 'react'
import { useState } from 'react'
import { FunctionComponent } from 'react'

interface IWrappedProps {
  isLoading?: boolean
  activities: string[]
  viewedActivities: string[]
  reload: (forceRefresh?: boolean) => Promise<void>
}

interface IEventProgressWrapperProps {
  event?: any
  eventUser?: any
  onLoading?: (isLoading: boolean) => void
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

/**
 * @deprecated The progress is gotten from the property activity_progresses to avoid double requesting
 */
const EventProgressWrapper: FunctionComponent<IEventProgressWrapperProps> = (props) => {
  const { event, eventUser, render, onLoading } = props

  const [isLoading, setIsLoading] = useState(false)
  const [activities, setActivities] = useState<string[]>([])
  const [viewedActivities, setViewedActivities] = useState<string[]>([])

  const reload = async () => {
    const ap = await FB.ActivityProgresses.get(event._id, eventUser.account_id)
    if (ap) {
      const { activities, viewed_activities } = ap
      setActivities(activities || [])
      setViewedActivities(viewed_activities || [])
    }
  }

  useEffect(() => {
    if (typeof onLoading === 'function') {
      onLoading(isLoading)
    }
  }, [isLoading])

  useEffect(() => {
    if (!event) return
    if (!eventUser) return

    setIsLoading(true)
    reload().finally(() => setIsLoading(false))
  }, [event, eventUser])

  return render({
    isLoading,
    activities,
    viewedActivities,
    reload,
  })
}

export default EventProgressWrapper
