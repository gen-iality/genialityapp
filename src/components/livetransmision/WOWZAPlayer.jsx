import React, { useEffect, useState } from 'react';
import ReactPlayer from 'react-player';
import { getLiveStream } from 'adaptors/wowzaStreamingAPI';
import VolumeOff from '@2fd/ant-design-icons/lib/VolumeOff';
import { Button } from 'antd';

function WOWZAPlayer({ meeting_id, thereIsConnection }) {
  const [platformurl, setPlatformurl] = useState(null);
  const [muted, setMuted] = useState(false);
  const [loopBackGround, setLoopBackGround] = useState(false);
  const defaultVideo =
    'https://firebasestorage.googleapis.com/v0/b/eviusauth.appspot.com/o/evius%2FCortinillaProntoIniciamos.mp4?alt=media&token=b31c0745-4542-4b55-b79c-357db7633c53';

  useEffect(() => {
    if (!meeting_id) return;
    if (thereIsConnection === 'No' || !thereIsConnection) {
      setLoopBackGround(false);
      setPlatformurl(defaultVideo);
      setMuted(true);
    } else if (thereIsConnection === 'Yes') {
      let asyncfunction = async () => {
        setLoopBackGround(true);
        setPlatformurl('none');
        let live_stream = await getLiveStream(meeting_id);
        let url = live_stream.player_hls_playback_url;
        /** se hace uso de un TimeOut para dar tiempo a wowza de inicializar la playList para que no devuelva error 404 la primera vez que el origen 'eviusMeets' envie data */
        setTimeout(() => {
          setPlatformurl(url);
          setMuted(true);
        }, 2000);
      };
      asyncfunction();
    }
    return () => {
      setLoopBackGround(false);
      setPlatformurl(null);
      setMuted(false);
    };
  }, [meeting_id, thereIsConnection]);

  return (
    <>
      <div className='mediaplayer'>
        {muted && thereIsConnection !== 'No' && (
          <Button
            onClick={() => setMuted(false)}
            shape='circle'
            style={{
              /* fontSize: '25px',  */
              position: 'absolute',
              top: 'auto',
              left: 'auto',
              zIndex: '500',
            }}
            icon={<VolumeOff />}
          />
        )}
        <ReactPlayer
          muted={muted}
          playing={true}
          loop={!loopBackGround}
          /* style={{ height: '100% !important', objectFit: 'cover' }} */
          height='100%'
          width='100%'
          url={platformurl}
          controls={loopBackGround}
          // config={{
          //   file: {
          //     forceHLS: loopBackGround,
          //   },
          // }}
        />
      </div>
    </>
  );
}

export default React.memo(WOWZAPlayer);
