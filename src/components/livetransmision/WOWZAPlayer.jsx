import React, { useEffect, useState } from 'react';
import ReactPlayer from 'react-player';
import { getLiveStream, getLiveStreamStatus, getLiveStreamStats } from 'adaptors/wowzaStreamingAPI';

function WOWZAPlayer({ meeting_id, thereIsConnection }) {
  const [platformurl, setPlatformurl] = useState(null);
  const [loopBackGround, setLoopBackGround] = useState(false);
  const defaultVideo =
    'https://firebasestorage.googleapis.com/v0/b/eviusauth.appspot.com/o/evius%2FLoading.mp4?alt=media&token=883ec61c-157a-408b-876c-b09f70402d14';

  useEffect(() => {
    setPlatformurl(null);
    if (!meeting_id) return;
    if (thereIsConnection === 'No') {
      setLoopBackGround(true), setPlatformurl(defaultVideo);
    } else if (thereIsConnection === 'Yes') {
      setLoopBackGround(false);
      let asyncfunction = async () => {
        let live_stream = await getLiveStream(meeting_id);
        let url = live_stream.player_hls_playback_url;
        setPlatformurl(url);
      };
      asyncfunction();
    }
    return () => {
      setLoopBackGround(false);
      setPlatformurl(null);
    };
  }, [meeting_id, thereIsConnection]);

  return (
    <>
      <ReactPlayer
        muted={true}
        playing={true}
        loop={loopBackGround}
        width={'100%'}
        height={'35vw'}
        style={{
          display: 'block',
          margin: '0 auto',
        }}
        url={platformurl}
        controls={!loopBackGround}
        config={{
          file: {
            forceHLS: loopBackGround,
          },
        }}
      />
    </>
  );
}

export default React.memo(WOWZAPlayer);
