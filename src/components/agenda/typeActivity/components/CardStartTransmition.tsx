import { useContext, useState } from 'react';
import { Card, Result, Space, Button, Spin, Popconfirm, Modal } from 'antd';
import LoadingTypeActivity from './LoadingTypeActivity';
import AgendaContext from '../../../../context/AgendaContext';
import { useEffect } from 'react';
import {
  deleteLiveStream,
  getLiveStream,
  getLiveStreamStatus,
  startLiveStream,
} from '../../../../adaptors/gcoreStreamingApi';
import { useQueryClient } from 'react-query';
import { useTypeActivity } from '../../../../context/typeactivity/hooks/useTypeActivity';
import { ExclamationCircleOutlined } from '@ant-design/icons';

const CardStartTransmition = (props: any) => {
  const [loading, setloading] = useState(false);
  const [loadingComponent, setloadingComponent] = useState(true);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const {
    meeting_id,
    setDataLive,
    dataLive,
    saveConfig,
    deleteTypeActivity,
    executer_startMonitorStatus,
    stopInterval,
    setHabilitarIngreso,
  } = useContext(AgendaContext);
  const { toggleActivitySteps } = useTypeActivity();
  const { confirm } = Modal;
  useEffect(() => {
    if (meeting_id) {
      saveConfig(null, 0);
      initializeStream();
    } else {
      stopInterval();
    }
    async function initializeStream() {
      const status = await getLiveStream(meeting_id);
      setDataLive(status);
      try {
        // await saveConfig(1);
        await executer_startMonitorStatus();
      } catch (e) {
        await executer_startMonitorStatus();
        // console.log('AL TRAER EL MEETING==>', e);
        // let livestreamInitial = { state: 'Finished' };
        // setLiveStreamStatus(livestreamInitial);
      }
      setloadingComponent(false);
    }
  }, [meeting_id]);

  const deleteStreaming = async () => {
    setLoadingDelete(true);
    deleteLiveStream(meeting_id);
    await deleteTypeActivity();
    toggleActivitySteps('initial');
    setLoadingDelete(false);
  };

  const executer_startStream = async () => {
    setloading(true);
    const liveStreamresponse = await startLiveStream(meeting_id);
    if (liveStreamresponse) {
      setDataLive(liveStreamresponse);
      executer_startMonitorStatus();
      setHabilitarIngreso('');
      setloading(false);
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
    //inicia el monitoreo
  };

  return !loadingComponent ? (
    <Card bodyStyle={{ padding: '21' }} style={{ borderRadius: '8px' }}>
      {loading ? (
        <LoadingTypeActivity />
      ) : (
        <Result
          title='Debes iniciar la transmisión'
          subTitle='Tus asistentes no verán lo que transmites hasta que cambies el estado de la transmisión para tus asistentes. '
          extra={
            <Space>
              {!loadingDelete ? (
                <Popconfirm
                  title={`¿Está seguro que desea ${
                    props.type === 'Transmisión' ||
                    props.type === 'EviusMeet' ||
                    props.type === 'vimeo' ||
                    props.type === 'Youtube'
                      ? 'eliminar transmisión'
                      : props.type === 'reunión'
                      ? 'eliminar sala de reunión'
                      : 'eliminar video'
                  }? `}
                  onConfirm={() => deleteStreaming()}
                  onCancel={() => console.log('cancelado')}
                  okText='Si'
                  cancelText='No'>
                  <Button type='text' danger>
                    {props.type === 'Transmisión' ||
                    props.type === 'EviusMeet' ||
                    props.type === 'vimeo' ||
                    props.type === 'Youtube'
                      ? 'Eliminar transmisión'
                      : props.type === 'reunión'
                      ? 'Eliminar sala de reunión'
                      : 'Eliminar video'}
                  </Button>
                </Popconfirm>
              ) : (
                <Spin />
              )}

              {!dataLive?.active && !loading ? (
                <Button onClick={() => executer_startStream()} type='primary'>
                  Iniciar transmisión
                </Button>
              ) : (
                loading && <Spin />
              )}
            </Space>
          }
        />
      )}
    </Card>
  ) : (
    <Spin />
  );
};

export default CardStartTransmition;
