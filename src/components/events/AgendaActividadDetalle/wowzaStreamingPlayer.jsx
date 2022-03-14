import React, { useState, useEffect, useContext } from 'react';
import WOWZAPlayer from '../../livetransmision/WOWZAPlayer';
import { getLiveStreamStatus, getLiveStreamStats } from 'adaptors/wowzaStreamingAPI';
import { CurrentUserContext } from 'context/userContext';
import { Grid } from 'antd';
import AgendaContext from 'context/AgendaContext';
import { CurrentEventUserContext } from 'context/eventUserContext';

const { useBreakpoint } = Grid;

function WowzaStreamingPlayer({ meeting_id, transmition, activity }) {
  const screens = useBreakpoint();
  const [livestreamStats, setLivestreamStats] = useState(null);
  const userContext = useContext(CurrentUserContext);
  const { request } = useContext(AgendaContext);
  const evetUserContext = useContext(CurrentEventUserContext);
  const [visibleMeets, setVisibleMeets] = useState(false);
  const [timer_id, setTimerId] = useState(null);
  //   const [livestreamStatus, setLivestreamStatus] = useState(null);
  const urlDefault =
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS4FLnQiNROZEVxb5XJ2yTan-j7TZKt-SI7Bw&usqp=CAU';
  const eviusmeetUrl = `https://eviusmeets.netlify.app/?meetingId=${activity._id}&rol=0&username=${
    userContext.value?.names
  }&email=${userContext.value?.email}&photo=${userContext.value?.picture || urlDefault}`;

  useEffect(() => {
    if (transmition !== 'EviusMeet' || !evetUserContext.value) return;
    if (request && request[evetUserContext.value._id] && request[evetUserContext.value._id].active) {
      setVisibleMeets(true);
    } else {
      setVisibleMeets(false);
    }
  }, [transmition, request, evetUserContext.value]);

  const executer_startMonitorStatus = async () => {
    let live_stream_status = null;
    let live_stream_stats = null;
    try {
      live_stream_status = await getLiveStreamStatus(meeting_id);
      //   setLivestreamStatus(live_stream_status);
      live_stream_stats = await getLiveStreamStats(meeting_id);
      setLivestreamStats(live_stream_stats);
    } catch (e) {}
    let timerId = setTimeout(executer_startMonitorStatus, 5000);
    setTimerId(timerId);
  };
  //ESCUCHA CUANDO LA TRANSMISION SE DETIENE
  useEffect(() => {
    if (livestreamStats && (livestreamStats.state === 'stopped' || !livestreamStats.state)) {
      clearTimeout(timer_id);
      setTimerId(null);
    }
  }, [livestreamStats]);

  // SI EXISTE UN MEETING ID SE EJECUTA EL MONITOR, PERO SE QUEDA COLGADO (TIMER)
  useEffect(() => {
    if (!meeting_id) return;
    executer_startMonitorStatus();
    return () => {
      clearTimeout(timer_id);
      setLivestreamStats(null);
    };
  }, [meeting_id]);

  return (
    <>
      {livestreamStats?.connected.value === 'Yes' ? (
        <>
          {((transmition == 'EviusMeet' && !visibleMeets) || transmition !== 'EviusMeet') && (
            <WOWZAPlayer meeting_id={meeting_id} thereIsConnection={livestreamStats?.connected.value} />
          )}
          {transmition == 'EviusMeet' && visibleMeets && (
            <div style={{ aspectRatio: screens.xs ? '9/12' : '16/9' }}>
              <iframe
                width={'100%'}
                style={{ height: '100%' }}
                allow='autoplay; fullscreen; camera *;microphone *'
                // sandbox='allow-scripts;allow-presentation; allow-modals'
                allowFullScreen
                allowusermedia
                src={eviusmeetUrl}></iframe>
            </div>
          )}
        </>
      ) : (
        <>
          {((transmition == 'EviusMeet' && !visibleMeets) || transmition !== 'EviusMeet') && (
            <WOWZAPlayer meeting_id={meeting_id} thereIsConnection={livestreamStats?.connected.value} />
          )}
          {transmition == 'EviusMeet' && visibleMeets && (
            <div style={{ aspectRatio: screens.xs ? '9/12' : '16/9' }}>
              <iframe
                width={'100%'}
                style={{ height: '100%' }}
                allow='autoplay; fullscreen; camera *;microphone *'
                // sandbox='allow-scripts;allow-presentation; allow-modals'
                allowFullScreen
                allowusermedia
                src={eviusmeetUrl}></iframe>
            </div>
          )}
        </>
      )}
      {/* {livestreamStatus?.state === 'started' ? (
        <>
          {livestreamStats?.connected.value === 'Yes' ? (
            <WOWZAPlayer meeting_id={meeting_id} />
          ) : (
            <WOWZAPlayer meeting_id={meeting_id} thereIsConnection={livestreamStats?.connected.value} />
          )}
        </>
      ) : (
        <h1>Streaming detenido</h1>
      )} */}
    </>
  );
}

export default WowzaStreamingPlayer;
