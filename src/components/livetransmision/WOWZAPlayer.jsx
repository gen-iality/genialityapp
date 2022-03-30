import { useContext, useEffect, useState } from 'react';
import ReactPlayer from 'react-player';
import { getLiveStream } from '../../adaptors/gcoreStreamingApi';
import VolumeOff from '@2fd/ant-design-icons/lib/VolumeOff';
import { Button } from 'antd';
import AgendaContext from '@/context/AgendaContext';

function WOWZAPlayer({ meeting_id, thereIsConnection }) {
  const defaultVideo =
    'https://firebasestorage.googleapis.com/v0/b/eviusauth.appspot.com/o/evius%2FLoading2.mp4?alt=media&token=8d898c96-b616-4906-ad58-1f426c0ad807';

  const [platformurl, setPlatformurl] = useState(defaultVideo);
  const [muted, setMuted] = useState(false);
  const [loopBackGround, setLoopBackGround] = useState(false);
  const { typeActivity } = useContext(AgendaContext);
  //SE CREA ESTE ESTADO POR QUE SE NECESITA REFRESCAR ESTE COMPONENTE EN EL DETALLE DE LA ACTIVIDAD
  const [conected, setConected] = useState('No');
  //console.log('DATOOS PLAYER===>', meeting_id, thereIsConnection);
  console.log('11. WOWZA PLAYER===>', typeActivity);
  useEffect(() => {
    if (!meeting_id) return;
    if (!thereIsConnection && typeActivity !== 'youTube') {
      setConected('No');
      setLoopBackGround(false);
      setPlatformurl(defaultVideo);
      setMuted(true);
    } else if (thereIsConnection) {
      let asyncfunction = async () => {
        setConected('Yes');
        setLoopBackGround(true);
        setPlatformurl('none');
        let live_stream = await getLiveStream(meeting_id);
        //console.log('LIVE STREAM===>', live_stream);
        let url = live_stream.hls_playlist_url;
        //console.log('100. URL==>', live_stream.hls_playlist_url);
        /** se hace uso de un TimeOut para dar tiempo a wowza de inicializar la playList para que no devuelva error 404 la primera vez que el origen 'eviusMeets' envie data */
        setTimeout(() => {
          setPlatformurl(url);
          setMuted(true);
        }, 2000);
      };
      asyncfunction();
    } else if (typeActivity === 'youTube') {
      console.log('11. ENTRA ACA===>');
      setConected('Yes');
      setPlatformurl('https://youtu.be/' + meeting_id);
    }
    return () => {
      setLoopBackGround(false);
      setPlatformurl(null);
      setMuted(false);
    };
  }, [meeting_id, thereIsConnection, typeActivity]);

  return (
    <>
      {console.log('100. WOWZAPLAYER=====>', thereIsConnection)}
      <div className='mediaplayer'>
        {muted && conected !== 'No' && (
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
          style={{ aspectRatio: '16/9' }}
          muted={muted}
          playing={true}
          loop={!loopBackGround}
          /* style={{ height: '100% !important', objectFit: 'cover' }} */
          // height='400px'
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
