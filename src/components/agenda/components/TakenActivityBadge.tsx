import { FB } from '@helpers/firestore-request'
import { Badge } from 'antd'
import { FunctionComponent, useEffect, useState } from 'react'

interface ITakenActivityBadgeProps {
  isTaken?: boolean
  textTaken?: string
  /**
   * If this is given, then a requesting will be done
   */
  activityId?: string
  eventUserId?: string
}

const TakenActivityBadge: FunctionComponent<ITakenActivityBadgeProps> = (props) => {
  const { activityId, eventUserId, textTaken } = props

  const [isTaken, setIsTaken] = useState(false)

  const requestAttendee = async () => {
    const activity_attendee = await FB.Attendees.get(activityId!, eventUserId!)

    return Boolean(activity_attendee?.checked_in)
  }

  useEffect(() => {
    if (props.isTaken !== undefined) {
      setIsTaken(props.isTaken)
    } else if (eventUserId && activityId) {
      requestAttendee().then((wasTaken) => setIsTaken(wasTaken))
    }
  }, [activityId, eventUserId, props.isTaken])

  if (!isTaken) return <></>

  return (
    <Badge
      style={{ backgroundColor: '#339D25', marginRight: '3px' }}
      count={textTaken ?? 'Visto'}
    />
  )
}
export default TakenActivityBadge
