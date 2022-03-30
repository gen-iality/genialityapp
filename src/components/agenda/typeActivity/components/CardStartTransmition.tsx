import { useContext, useState } from 'react';
import { Card, Result, Space, Button, Spin } from 'antd';
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

const CardStartTransmition = () => {
  const [loading, setloading] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const { meeting_id, setDataLive, dataLive, saveConfig, deleteTypeActivity } = useContext(AgendaContext);
  const { toggleActivitySteps } = useTypeActivity();
  const queryClient = useQueryClient();
  const [timerId, setTimerId] = useState(null);
  useEffect(() => {
    if (meeting_id) {
      saveConfig(null, 0);
      initializeStream();
    } else {
      clearTimeout(timerId);
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
    }
  }, [meeting_id]);

  const deleteStreaming = async () => {
    setLoadingDelete(true);
    deleteLiveStream(meeting_id);
    await deleteTypeActivity();
    toggleActivitySteps('initial');
    setLoadingDelete(false);
  };

  const executer_startMonitorStatus = async () => {
    let live_stream_status = null;
    try {
      live_stream_status = await getLiveStreamStatus(meeting_id);

      // console.log('live_stream_status', live_stream_status);
      console.log('10. EJECUTANDOSE EL MONITOR===>', live_stream_status.active);

      if (dataLive && dataLive?.active !== live_stream_status.active) {
        setDataLive(live_stream_status);
      }
    } catch (e) {}
    const timer_id = setTimeout(executer_startMonitorStatus, 5000);
    setTimerId(timer_id);
    if (!live_stream_status.active) {
      clearTimeout(timer_id);
    }
  };

  const executer_startStream = async () => {
    setloading(true);
    const liveStreamresponse = await startLiveStream(meeting_id);
    setDataLive(liveStreamresponse);
    executer_startMonitorStatus();
    setloading(false);
    //inicia el monitoreo
  };

  return (
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
                <Button onClick={() => deleteStreaming()} type='text' danger>
                  Eliminar transmisión
                </Button>
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
  );
};

export default CardStartTransmition;
