import { Card, Button, Space, Typography, Spin, Popconfirm } from 'antd';
import { DeleteOutlined, WarningOutlined } from '@ant-design/icons';
import AgendaContext from '@context/AgendaContext';
import { useContext, useState, useMemo } from 'react';
import { deleteLiveStream, deleteAllVideos } from '@/adaptors/gcoreStreamingApi';
import { AgendaApi } from '@/helpers/request';
import { CurrentEventContext } from '@context/eventContext';
import useActivityType from '@context/activityType/hooks/useActivityType';
import type { ActivityType } from '@context/activityType/types/activityType';

export interface TransmitionOptionsCardProps {
  type: ActivityType.TypeAsDisplayment,
};

const TransmitionOptionsCard = (props: TransmitionOptionsCardProps) => {
  const {
    type,
  } = props;

  const [isDeleting, setIsDeleting] = useState(false);
  const {
    is,
    setActivityContentType,
    executer_stopStream,
    resetActivityType,
  } = useActivityType();

  const {
    dataLive,
    meeting_id,
    setDataLive,
    setMeetingId,
    deleteTypeActivity,
    activityEdit,
    removeAllRequest,
  } = useContext(AgendaContext);

  const cEvent: any = useContext(CurrentEventContext);

  const deleteTransmition = async () => {
    console.debug('deleteTransmition is called');
    deleteLiveStream(meeting_id);
    // await deleteTypeActivity();
    await resetActivityType('liveBroadcast');
  };

  const refActivity = useMemo(() =>(
    `request/${cEvent.value?._id}/activities/${activityEdit}`), [cEvent, activityEdit]);
  const refActivityViewers = useMemo(() =>(
    `viewers/${cEvent.value?._id}/activities/${activityEdit}`), [cEvent, activityEdit]);
  const isVisible = useMemo(
    () => type === 'Transmisión' || type === 'EviusMeet',
    [type],
  );

  const deletingMessage = useMemo(() => {
    if (type === 'Transmisión' || type === 'EviusMeet' || type === 'vimeo' || type === 'Youtube')
      return 'eliminar transmisión';
    if (type === 'reunión')
      return 'eliminar sala de reunión';
    return 'eliminar video';
  }, [type])

  const handleConfirmDeleting = async () => {
    setIsDeleting(true);
    if (isVisible && meeting_id) {
      await deleteAllVideos(dataLive.name, meeting_id);
      await removeAllRequest(refActivity);
      await deleteTransmition();
    }
    await AgendaApi.editOne({ video: null }, activityEdit, cEvent?.value?._id);
    // await deleteTypeActivity();

    setMeetingId(null);
    setDataLive(null);

    setActivityContentType(null); // last "toggleActivitySteps('initial')";
    setIsDeleting(false);
    switch (type) {
      case 'Video':
        console.debug('TransmitionOptionsCard reset AT to video');
        await resetActivityType('video');
        break;
      case 'reunión':
        console.debug('TransmitionOptionsCard reset AT to meeting2');
        await resetActivityType('meeting2');
        break;
      case 'Transmisión':
      case 'EviusMeet':
      case 'vimeo':
      case 'Youtube':
        console.debug('TransmitionOptionsCard reset AT to liveBroadcast');
        await resetActivityType('liveBroadcast');
    }
    // Check type, await resetActivityType('liveBroadcast');
  };

  return (
    <Card bodyStyle={{ padding: '21' }} style={{ borderRadius: '8px' }}>
      <Card.Meta
        title={
          <Typography.Text style={{ fontSize: '20px' }} strong>
            Opciones de {props.type}
          </Typography.Text>
        }
        avatar={<WarningOutlined style={{ color: '#FE5455', fontSize: '25px' }} />}
        description={
          <Space>
            {isVisible && dataLive?.active && (
              <Button
                loading={is.stoppingStreaming}
                type='primary'
                danger
                onClick={() => executer_stopStream()}
              >
                Detener
              </Button>
            )}
            {
              <Popconfirm
                title={`¿Está seguro que desea ${deletingMessage}?`}
                onConfirm={handleConfirmDeleting}
                onCancel={() => console.log('cancelado')}
                okText='Sí'
                cancelText='No'>
                <Button loading={isDeleting} danger>
                  Eliminar
                </Button>
              </Popconfirm>
            }
          </Space>
        }
      />
    </Card>
  );
};

export default TransmitionOptionsCard;
