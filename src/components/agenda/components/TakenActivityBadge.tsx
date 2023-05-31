import { firestore } from '@helpers/firebase'
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
    const activity_attendee = await firestore
      .collection(`${activityId}_event_attendees`)
      .doc(eventUserId)
      .get() //checkedin_at
    if (activity_attendee && activity_attendee.exists) {
      // If this activity existes, then it means the lesson was taken
      return activity_attendee.data()?.checked_in as boolean
    }
    return false
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
