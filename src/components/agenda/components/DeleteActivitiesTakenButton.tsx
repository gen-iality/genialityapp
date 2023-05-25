import { Button } from 'antd'
import { DeleteOutlined } from '@ant-design/icons'
import { AgendaApi } from '@helpers/request'
import { firestore } from '@helpers/firebase'
import { Link } from 'react-router-dom'
import { useCallback } from 'react'

interface DeleteActivitiesTakenButtonProps {
  eventId: string
  cEventUserId?: string
  setActivitiesAttendeeIsDeleted?: any
  setActivitiesAttendee?: any
}

/** @deprecated remove temporally because setActivitiesAttendee */
export function DeleteActivitiesTakenButton(props: DeleteActivitiesTakenButtonProps) {
  const {
    eventId, // The event ID
    cEventUserId, // The event user ID
    setActivitiesAttendeeIsDeleted,
    setActivitiesAttendee,
  } = props

  const deleteActivitiesTaken = useCallback(
    async (cEventUserId: any, eventId: any) => {
      const { data } = await AgendaApi.byEvent(eventId)
      await Promise.all(
        data.map(async (activity: any) => {
          await firestore
            .collection(`${activity._id}_event_attendees`)
            .doc(cEventUserId)
            .delete()
        }),
      )

      setActivitiesAttendee([])
      setActivitiesAttendeeIsDeleted((prevState: any) => !prevState)
    },
    [cEventUserId, eventId],
  )

  return (
    <Link to={`/landing/${eventId}/agenda`} replace>
      <Button
        style={{
          background: '#B8415A',
          color: '#fff',
          border: 'none',
          fontSize: '12px',
          height: '20px',
          lineHeight: '20px',
          borderRadius: '10px',
          marginLeft: '2px',
        }}
        size="small"
        icon={<DeleteOutlined />}
        onClick={() => deleteActivitiesTaken(cEventUserId, eventId)}
      >
        Eliminar actividades vistas
      </Button>
    </Link>
  )
}
