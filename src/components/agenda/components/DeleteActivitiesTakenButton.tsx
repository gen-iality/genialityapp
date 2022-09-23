import { Button } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { AgendaApi } from '@/helpers/request';
import { firestore } from '@/helpers/firebase';

interface DeleteActivitiesTakenButtonProps {
  eventId: string;
  cEventUserId?: string;
}

export function DeleteActivitiesTakenButton(props: DeleteActivitiesTakenButtonProps) {
  const {
    eventId, // The event ID
    cEventUserId, // The event user ID
  } = props;

  async function deleteActivitiesTaken(cEventUserId: any, eventId: any) {
    console.log('700.Aquí se eliminan las actividades vistas');
    console.log('700.deleteActivitiesTaken eventId', eventId);
    const { data } = await AgendaApi.byEvent(eventId);
    console.log('700.data:', data);
    console.log('700.cEventUserId:', cEventUserId);
    data.map(async (activity: any) => {
      console.log('700.Elimnación map');
      await firestore
        .collection(`${activity._id}_event_attendees`)
        .doc(cEventUserId)
        .delete();
    });
  }

  return (
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
      size='small'
      icon={<DeleteOutlined />}
      onClick={() => deleteActivitiesTaken(cEventUserId, eventId)}
    >
      Eliminar actividades vistas
    </Button>
  );
}
