import { Button, Spin, Alert, Typography } from 'antd';
const { Text, Link, Title } = Typography;
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import WOWZAPlayer from 'components/livetransmision/WOWZAPlayer';
import {
  createLiveStream,
  getLiveStream,
  stopLiveStream,
  startLiveStream,
  getLiveStreamStatus,
  getLiveStreamStats,
} from 'adaptors/wowzaStreamingAPI';

const WowzaStreamingPanel = ({ meeting_id, created_action, stopped_action, activityDispatch }) => {
  console.log('props', meeting_id, created_action, stopped_action);
  //const [livestream, setLivestream] = useState(null);
  const [livestreamStatus, setLivestreamStatus] = useState(null);
  const [livestreamStats, setLivestreamStats] = useState(null);
  const [linkeviusmeets, setLinkeviusmeets] = useState(null);

  const queryClient = useQueryClient();
  console.log('innerRender', meeting_id);
  const livestreamQuery = useQuery(['livestream', meeting_id], () => getLiveStream(meeting_id));

  //Link para eviusmeet dónde se origina el video
  const eviusmeets = `https://eviusmeets.netlify.app/prepare`;
  useEffect(() => {
    if (livestreamQuery && livestreamQuery.data) {
      let rtmplink = livestreamQuery.data.source_connection_information;
      let linkeviusmeetsi =
        eviusmeets + `?meetingId=${'mocion4'}&rtmp=${rtmplink.primary_server}/${rtmplink.stream_name}`;
      setLinkeviusmeets(linkeviusmeetsi);
    }
  }, [livestreamQuery.data]);

  console.log('linkeviusmeets', linkeviusmeets);
  useEffect(() => {
    if (meeting_id) executer_startMonitorStatus(meeting_id);
  }, [meeting_id]);

  const executer_createStream = useMutation(createLiveStream, {
    onSuccess: (data) => {
      console.log('sucks', data);
      queryClient.setQueryData('livestream', data);
      activityDispatch({ type: 'meeting_created', meeting_id: data.id });
      // Invalidate and refetch
      //queryClient.invalidateQueries('todos')
    },
  });

  const executer_startMonitorStatus = async () => {
    let live_stream_status = null;
    let live_stream_stats = null;
    try {
      live_stream_status = await getLiveStreamStatus(meeting_id);
      console.log('live_stream_status', live_stream_status);
      setLivestreamStatus(live_stream_status);

      live_stream_stats = await getLiveStreamStats(meeting_id);
      setLivestreamStats(live_stream_stats);
    } catch (e) {}
    const timer_id = setTimeout(executer_startMonitorStatus, 5000);
    if (live_stream_status && live_stream_status.state == 'stopped') {
      clearTimeout(timer_id);
    }
  };

  const executer_startStream = async () => {
    const liveStreamresponse = await startLiveStream(meeting_id);
    executer_startMonitorStatus();
    //inicia el monitoreo
  };

  const executer_stopStream = async () => {
    const liveStreamresponse = await stopLiveStream(meeting_id);
    queryClient.setQueryData('livestream', null);
  };

  if (!livestreamQuery.data)
    return (
      <>
        <Spin tip='Loading...' spinning={executer_createStream.isLoading}>
          <Button onClick={() => executer_createStream.mutate()}>Crear</Button>
        </Spin>

        {executer_createStream.isError && (
          <>
            {console.log('executer_createStream', executer_createStream)}
            <Alert
              message={
                'An error occurred:' +
                executer_createStream.error.message +
                ' ' +
                executer_createStream.error?.response?.data?.meta?.message
              }
              type='error'
              showIcon
              closable
            />
          </>
        )}
      </>
    );

  return (
    <>
      <br />
      <br />
      <p>
        <p>
          Queda pendiente revisar el estado inicial de la reunión, agregar estados de error a los botones de start,
          stop,
        </p>
        <b>Id:</b> {meeting_id}
      </p>
      <Button
        onClick={() => {
          executer_startStream();
        }}>
        Iniciar
      </Button>
      <Button
        onClick={() => {
          executer_stopStream();
        }}>
        Detener
      </Button>
      <Button onClick={() => {}}>Reiniciar</Button>
      <br />
      <br />

      <br />
      {livestreamStatus && (
        <>
          <b>Streaming Status: </b>
          {livestreamStatus.state !== 'started' && livestreamStatus.state != 'stopped' && <Spin />}
          {livestreamStatus.state}
          <br />
        </>
      )}
      {livestreamStats && livestreamStats.connected && (
        <>
          <b>Origin Connected:</b> {livestreamStats?.connected.value}
          <br />
        </>
      )}
      {livestreamStats && livestreamStats.connected && (
        <>
          <b>Origin Status:</b> {livestreamStats?.connected.status}
          <br />
        </>
      )}
      {livestreamStats && livestreamStats.connected && (
        <>
          <b>Origin Problem reason: </b>
          {livestreamStats?.connected.text}
          <br />
        </>
      )}

      <br />
      {linkeviusmeets && (
        <Link href={linkeviusmeets} target='_blank'>
          Entrar a EviusMeets para transmitir
        </Link>
      )}
      <br />
      <br />
      <WOWZAPlayer meeting_id={meeting_id} />

      <p>Coloca estos datos en tu plataforma de captura de video para transmitirlo:</p>
      <ul>
        {/* Algunos datos adicionales que se podrían mostrar
            <li>
              <b>player_embed_code: </b>
              {streamconfig.player_embed_code}
            </li>
            <li>
              <b>player_hls_playback_url: </b>
              {streamconfig.player_hls_playback_url}
            </li> */}

        <li>
          <b>RTMP url:</b> {livestreamQuery.data.source_connection_information.primary_server}
        </li>
        <li>
          <b>RTMP clave:</b> {livestreamQuery.data.source_connection_information.stream_name}
        </li>
      </ul>
    </>
  );
};
export default WowzaStreamingPanel;
