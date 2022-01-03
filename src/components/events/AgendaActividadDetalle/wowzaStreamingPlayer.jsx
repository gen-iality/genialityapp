import React, { useState, useEffect } from 'react';
import WOWZAPlayer from '../../livetransmision/WOWZAPlayer';
import { getLiveStreamStatus, getLiveStreamStats } from 'adaptors/wowzaStreamingAPI';

function WowzaStreamingPlayer({ meeting_id }) {
  const [livestreamStats, setLivestreamStats] = useState(null);
  //   const [livestreamStatus, setLivestreamStatus] = useState(null);

  let timer_id = null;

  const executer_startMonitorStatus = async () => {
    let live_stream_status = null;
    let live_stream_stats = null;
    try {
      live_stream_status = await getLiveStreamStatus(meeting_id);
      //   setLivestreamStatus(live_stream_status);
      live_stream_stats = await getLiveStreamStats(meeting_id);
      setLivestreamStats(live_stream_stats);
    } catch (e) {}
    timer_id = setTimeout(executer_startMonitorStatus, 5000);

    if (live_stream_status && live_stream_status.state === 'stopped') {
      clearTimeout(timer_id);
    }
  };

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
        <WOWZAPlayer meeting_id={meeting_id} thereIsConnection={livestreamStats?.connected.value} />
      ) : (
        <WOWZAPlayer meeting_id={meeting_id} thereIsConnection={livestreamStats?.connected.value} />
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
