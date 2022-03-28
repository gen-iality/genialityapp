import { useContext, useState } from 'react';
import { Card, Result, Space, Button, Spin } from 'antd';
import LoadingTypeActivity from './LoadingTypeActivity';
import AgendaContext from '../../../../context/AgendaContext';
import { useEffect } from 'react';
import {
  createLiveStream,
  deleteLiveStream,
  getLiveStream,
  getLiveStreamStatus,
  startLiveStream,
  stopLiveStream,
} from '../../../../adaptors/gcoreStreamingApi';
import { useMutation, useQueryClient } from 'react-query';
import { useTypeActivity } from '../../../../context/typeactivity/hooks/useTypeActivity';

const CardStartTransmition = () => {
  const [loading, setloading] = useState(false);
  const { meeting_id, setDataLive, dataLive, saveConfig } = useContext(AgendaContext);
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
        /*console.log('AL TRAER EL MEETING==>', e);
        let livestreamInitial = { state: 'Finished' };
        setLivestreamStatus(livestreamInitial);*/
      }
    }
  }, [meeting_id]);

  /* const deleteStreaming = async () => {
    deleteLiveStream(meeting_id);
    await deleteTypeActivity();
    toggleActivitySteps('initial');
  };*/

  const executer_startMonitorStatus = async () => {
    let live_stream_status = null;
    try {
      live_stream_status = await getLiveStreamStatus(meeting_id);

      // console.log('live_stream_status', live_stream_status);
      console.log('10. EJECUTANDOSE EL MONITOR===>', live_stream_status.active);
      setDataLive(live_stream_status);
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
              {/*!liveStreamStatus.active && (
                <Button onClick={() => deleteStreaming()} type='text' danger>
                  Eliminar transmisión
                </Button>
              )*/}
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
