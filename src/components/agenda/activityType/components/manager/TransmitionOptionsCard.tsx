import { Card, Button, Space, Typography, Spin, Popconfirm } from 'antd';
import { DeleteOutlined, WarningOutlined } from '@ant-design/icons';
import AgendaContext from '@context/AgendaContext';
import { useContext, useState, useMemo } from 'react';
import { deleteLiveStream, deleteAllVideos } from '@/adaptors/gcoreStreamingApi';
import { AgendaApi } from '@/helpers/request';
import { CurrentEventContext } from '@context/eventContext';
import useActivityType from '@context/activityType/hooks/useActivityType';
import type { ActivityType } from '@context/activityType/types/activityType';
import { TypeDisplayment, MainUI } from '@/context/activityType/constants/enum';

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
    removeViewers,
    saveConfig,
    setRoomStatus,
  } = useContext(AgendaContext);

  const cEvent: any = useContext(CurrentEventContext);

  const deleteTransmition = async () => {
    console.debug('deleteTransmition is called');
    deleteLiveStream(meeting_id);
    setDataLive(null);
    await resetActivityType('liveBroadcast');
  };

  const refActivity = useMemo(() =>(
    `request/${cEvent.value?._id}/activities/${activityEdit}`), [cEvent, activityEdit]);
  const refActivityViewers = useMemo(() =>(
    `viewers/${cEvent.value?._id}/activities/${activityEdit}`), [cEvent, activityEdit]);
  const isVisible = useMemo(
    () => type === TypeDisplayment.TRANSMISSION || type === TypeDisplayment.EVIUS_MEET,
    [type],
  );

  const deletingMessage = useMemo(() => {
    if (type === TypeDisplayment.TRANSMISSION || type === TypeDisplayment.EVIUS_MEET || type === TypeDisplayment.VIMEO || type === TypeDisplayment.YOUTUBE)
      return 'eliminar transmisión';
    if (type === TypeDisplayment.MEETING)
      return 'eliminar sala de reunión';
    return 'eliminar video';
  }, [type])

  const handleConfirmDeleting = async () => {
    try {
      executer_stopStream();
    } catch (e) {
      console.error('handleConfirmDeleting', e);
    }
    setIsDeleting(true);
    if (isVisible && meeting_id) {
      await deleteAllVideos(dataLive.name, meeting_id);
      await removeAllRequest(refActivity);
      await deleteTransmition();
    }
    await removeViewers(refActivityViewers);
    await AgendaApi.editOne({ video: null }, activityEdit, cEvent?.value?._id);
    // await deleteTypeActivity();

    setDataLive(null);

    const value = 'created_meeting_room';
    console.debug('saves value of RoomStatus:', value);
    setRoomStatus(value);
    setMeetingId(null);
    await saveConfig({ habilitar_ingreso: value, data: null });
    console.log('config saved - habilitar_ingreso:', value);

    setActivityContentType(null); // last "toggleActivitySteps('initial')";
    switch (type) {
      case TypeDisplayment.VIDEO:
        console.debug('TransmitionOptionsCard reset AT to video');
        await resetActivityType(MainUI.VIDEO);
        break;
      case TypeDisplayment.MEETING:
        console.debug('TransmitionOptionsCard reset AT to meeting2');
        await resetActivityType(MainUI.MEETING);
        break;
      case TypeDisplayment.TRANSMISSION:
      case TypeDisplayment.EVIUS_MEET:
      case TypeDisplayment.VIMEO:
      case TypeDisplayment.YOUTUBE:
        console.debug('TransmitionOptionsCard reset AT to liveBroadcast');
        await resetActivityType(MainUI.LIVE);
    }
    setIsDeleting(false);
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
