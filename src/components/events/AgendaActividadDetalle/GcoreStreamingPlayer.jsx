import { useState, useEffect, useContext } from 'react';
import GcorePlayer from '../../livetransmision/GcorePlayer';
import { CurrentUserContext } from '../../../context/userContext';
import { Grid } from 'antd';
import AgendaContext from '../../../context/AgendaContext';
import { CurrentEventUserContext } from '../../../context/eventUserContext';
import { getLiveStreamStatus } from '../../../adaptors/gcoreStreamingApi';

const { useBreakpoint } = Grid;

function GcoreStreamingPlayer({ meeting_id, transmition, activity }) {

  const screens = useBreakpoint();

  const userContext = useContext(CurrentUserContext);
  const { request, typeActivity } = useContext(AgendaContext);
  const evetUserContext = useContext(CurrentEventUserContext);

  const [ livestreamStatus, setLivestreamStatus ] = useState(null);
  const [ visibleMeets, setVisibleMeets ] = useState(false);
  const [ timer_id, setTimerId ] = useState(null);

  //   const [livestreamStatus, setLivestreamStatus] = useState(null);
  const urlDefault = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS4FLnQiNROZEVxb5XJ2yTan-j7TZKt-SI7Bw&usqp=CAU';

  const eviusmeetUrl = `https://stagingeviusmeet.netlify.app/?meetingId=${activity._id}&rol=0&username=${userContext.value?.names}&email=${userContext.value?.email}&photo=${userContext.value?.picture || urlDefault}`;

  // Ejecuta el acceso a la solicitud del estudiante de participar en la transmisión
  useEffect(() => {
    if (transmition !== 'EviusMeet' || !evetUserContext.value) return;
    if (request && request[ evetUserContext.value._id ] && request[ evetUserContext.value._id ].active) {
      setVisibleMeets(true);
    } else {
      setVisibleMeets(false);
    }
  }, [ transmition, request, evetUserContext.value ]);

  // Solicitudes a la API de Gcore
  const executer_startMonitorStatus = async () => {
    console.log('executer_startMonitorStatus==>', meeting_id, typeActivity);
    if (meeting_id === null || meeting_id === '' || typeActivity === 'url' || typeActivity === 'video') return;
    let live_stream_status = null;
    try {
      live_stream_status = await getLiveStreamStatus(meeting_id);
      live_stream_status && setLivestreamStatus(live_stream_status);
      console.log('live_stream_status=>', live_stream_status);
      let timerId = setTimeout(executer_startMonitorStatus, 5000);
      setTimerId(timerId);
    } catch (e) {
      timer_id && clearInterval(timer_id);
    }
  };

  //Escucha cuando la transmisión se detiene
  useEffect(() => {
    if (!livestreamStatus?.active) {
      clearTimeout(timer_id);
      setTimerId(null);
    }
  }, [ livestreamStatus ]);

  // Si existe un meeting id se ejecuta el monitor, pero se queda colgado (timer)
  useEffect(() => {
    console.log('meeting_ID==>', meeting_id);
    if (!meeting_id && timer_id) clearTimeout(timer_id);
    if (!meeting_id && (typeActivity == 'youTube' || typeActivity == 'vimeo' || !typeActivity)) return;
    executer_startMonitorStatus();
    return () => {
      clearTimeout(timer_id);
      setLivestreamStatus(null);
    };
  }, [ meeting_id, typeActivity ]);

  return (
    <>
      {livestreamStatus?.live ? (
        <>
          {((transmition == 'EviusMeet' && !visibleMeets) || transmition !== 'EviusMeet') && (
            <>
              <GcorePlayer meeting_id={meeting_id} thereIsConnection={livestreamStatus?.live} />
            </>
          )}
          {transmition == 'EviusMeet' && visibleMeets && (
            <div style={{ aspectRatio: screens.xs ? '9/12' : '16/9' }}>
              <iframe
                width={'100%'}
                style={{ height: '100%' }}
                allow='autoplay; fullscreen; camera *;microphone *'
                allowFullScreen
                allowusermedia
                src={eviusmeetUrl}
                frameBorder='0'></iframe>
            </div>
          )}
        </>
      ) : (
        <>
          {((transmition == 'EviusMeet' && !visibleMeets) || transmition !== 'EviusMeet') && (
            <>
              <GcorePlayer meeting_id={meeting_id} thereIsConnection={livestreamStatus?.live} />
            </>
          )}
          {transmition == 'EviusMeet' && visibleMeets && (
            <div style={{ aspectRatio: screens.xs ? '9/12' : '16/9' }}>
              <iframe
                width={'100%'}
                style={{ height: '100%' }}
                allow='autoplay; fullscreen; camera *;microphone *'
                allowFullScreen
                allowusermedia
                src={eviusmeetUrl}
                frameBorder='0'></iframe>
            </div>
          )}
        </>
      )}
    </>
  );
}

export default GcoreStreamingPlayer;
