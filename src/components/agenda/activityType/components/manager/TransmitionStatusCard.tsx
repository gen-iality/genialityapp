import { useContext, useState, useMemo } from 'react';
import { Card, Result, Space, Button, Spin, Popconfirm, Modal, message } from 'antd';
import LoadingActivityType from '../LoadingActivityType';
import AgendaContext from '@context/AgendaContext';
import { useEffect } from 'react';
import {
  deleteLiveStream,
  getLiveStream,
  getLiveStreamStatus,
  startLiveStream,
  deleteAllVideos,
} from '@/adaptors/gcoreStreamingApi';
import { useQueryClient } from 'react-query';
import useActivityType from '@context/activityType/hooks/useActivityType';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { CurrentEventContext } from '@context/eventContext';
import type { ActivityType } from '@/context/activityType/types/activityType';
import { TypeDisplayment } from '@/context/activityType/constants/enum';

const { confirm } = Modal;

// TypeDisplayment.EVIUS_MEET | TypeDisplayment.TRANSMISSION
interface TransmitionStatusCardProps {
  type: ActivityType.TypeAsDisplayment,
};

const TransmitionStatusCard = (props: TransmitionStatusCardProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingComponent, setIsLoadingComponent] = useState(true);
  const [isLoadingDelete, setIsLoadingDelete] = useState(false);
  const [isBlockedButton, setIsBlockedButton] = useState(false);
  const {
    meeting_id,
    setDataLive,
    dataLive,
    saveConfig,
    deleteTypeActivity,
    executer_startMonitorStatus,
    stopInterval,
    setRoomStatus,
    removeAllRequest,
    activityEdit,
  } = useContext(AgendaContext);

  const cEvent = useContext(CurrentEventContext);
  const refActivity = `request/${cEvent.value?._id}/activities/${activityEdit}`;
  const refActivityViewers = `viewers/${cEvent.value?._id}/activities/${activityEdit}`;
  const { resetActivityType } = useActivityType();

  useEffect(() => {
    console.debug('meeting_id is', meeting_id, 'rn');
    if (meeting_id) {
      saveConfig(null, 0);
      initializeStream();
    } else {
      stopInterval();
    }

    async function initializeStream() {
      console.debug('trying initialize stream to meeting_id:', meeting_id);
      try {
        const status = await getLiveStream(meeting_id);
        setDataLive(status);
        // await saveConfig(1);
        await executer_startMonitorStatus();
      } catch (e) {
        await executer_startMonitorStatus();
        setIsLoading(false);
        setIsBlockedButton(true);
        message.error('El id de la transmisión no existe!');
        console.error(e);
      }
      setIsLoadingComponent(false);
    }
  }, [meeting_id]);

  const deleteStreaming = async () => {
    setIsLoadingDelete(true);
    deleteAllVideos(dataLive?.name, meeting_id); // verificar si se va a eliminar los vídeos cuando se elimana la transmision
    deleteLiveStream(meeting_id);
    await removeAllRequest(refActivity);
    await deleteTypeActivity();
    // Transmition stuffs must go back to 'liveBroadcast'
    await resetActivityType('liveBroadcast'); // reset the content tab?
    setIsLoadingDelete(false);
  };

  const executer_startStream = async () => {
    setIsLoading(true);
    try {
      const liveStreamresponse = await startLiveStream(meeting_id);
      if (liveStreamresponse) {
        setDataLive(liveStreamresponse);
        setRoomStatus('');
        saveConfig({ habilitar_ingreso: '' }, 1);
        executer_startMonitorStatus();
        setIsLoading(false);
      } else {
        confirm({
          title: 'Error',
          icon: <ExclamationCircleOutlined />,
          content: 'Ha ocurrido un error al iniciar la trasnmisión',
          onOk() {
            window.location.reload();
          },
          onCancel() {},
          cancelButtonProps: {
            disabled: true,
          },
        });
      }
    } catch (err) {
      console.error('executer_startStream error', err);
      setIsLoading(false);
    }

    //inicia el monitoreo
  };

  const popconfirmMessage = useMemo(() => {
    if (props.type === TypeDisplayment.TRANSMISSION || props.type === TypeDisplayment.EVIUS_MEET || props.type === TypeDisplayment.VIMEO || props.type === TypeDisplayment.YOUTUBE)
      return 'Eliminar transmisió';
    if (props.type === TypeDisplayment.MEETING)
      return 'Eliminar sala de reunión';
    return 'Eliminar video';
  }, [props.type]);

  return isLoadingComponent ? (
    <Card bodyStyle={{ padding: '21' }} style={{ borderRadius: '8px' }}>
      <LoadingActivityType />
    </Card>
  ) : (
    <Card bodyStyle={{ padding: '21' }} style={{ borderRadius: '8px' }}>
      {isLoading ? (
        <LoadingActivityType />
      ) : (
        <Result
          title='Debes iniciar la transmisión'
          subTitle='Tus asistentes no verán lo que transmites hasta que cambies el estado de la transmisión para tus asistentes. '
          extra={
            <Space>
              {
                <Popconfirm
                  title={`¿Está seguro que desea ${popconfirmMessage.toLowerCase()}? `}
                  onConfirm={() => deleteStreaming()}
                  onCancel={() => console.info(`Eliminación en "${popconfirmMessage.toLowerCase()}" cancelado`)}
                  okText='Sí'
                  cancelText='No'>
                  <Button loading={isLoadingDelete} type='text' danger>
                    {popconfirmMessage}
                  </Button>
                </Popconfirm>
              }

              {!dataLive?.active && (
                <Button
                  disabled={isBlockedButton}
                  loading={isLoading}
                  onClick={() => executer_startStream()}
                  type='primary'>
                  Iniciar transmisión
                </Button>
              )}
            </Space>
          }
        />
      )}
    </Card>
  );
};

export default TransmitionStatusCard;
