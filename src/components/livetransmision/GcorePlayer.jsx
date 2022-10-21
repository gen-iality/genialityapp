import { useContext, useEffect, useState, memo } from 'react';
import ReactPlayer from 'react-player';
import { getLiveStream } from '../../adaptors/gcoreStreamingApi';
import VolumeOff from '@2fd/ant-design-icons/lib/VolumeOff';
import { Button, Spin } from 'antd';
import AgendaContext from '@context/AgendaContext';
import { CurrentUserContext } from '@context/userContext';
import { Grid } from 'antd';

const { useBreakpoint } = Grid;

function GcorePlayer({ meeting_id, thereIsConnection }) {

  const screens = useBreakpoint();

  const defaultVideo = 'https://firebasestorage.googleapis.com/v0/b/geniality-sas.appspot.com/o/public%2Fgeniality-loading-streaming.mp4?alt=media&token=97dc8cbf-dc80-477d-862c-6be0eeb11076';

  const { typeActivity, activityEdit } = useContext(AgendaContext);
  const userContext = useContext(CurrentUserContext);

  const [ platformurl, setPlatformurl ] = useState(defaultVideo);
  const [ visibleReactPlayer, setVisibleReactPlayer ] = useState(false);
  const [ conected, setConected ] = useState('No');

  useEffect(() => {
    if (!meeting_id) return;
    if (!thereIsConnection) {
      console.log('100. INGRESA ACA 1===>', typeActivity, thereIsConnection);
      setConected('Yes');
      setPlatformurl(defaultVideo);
      setVisibleReactPlayer(true);
    } else if (thereIsConnection) {
      console.log('100. INGRESA ACA 2===>', typeActivity, thereIsConnection);
      const asyncfunction = async () => {
        setConected('Yes');
        setPlatformurl('none');
        const live_stream = await getLiveStream(meeting_id);
        console.log('LIVE STREAM===>', live_stream);
        const url = live_stream.iframe_url;
        visibleReactPlayer && setVisibleReactPlayer(false);

        //console.log('100. URL==>', live_stream.hls_playlist_url);
        /** se hace uso de un TimeOut para dar tiempo a wowza de inicializar la playList para que no devuelva error 404 la primera vez que el origen 'eviusMeets' envie data */
        setTimeout(() => {
          const aditionalParameters = typeActivity !== 'url' ? '?muted=1&autoplay=1' : '';
          setPlatformurl(url + aditionalParameters);
        }, 2000);
      };
      asyncfunction();
    } else if (typeActivity === 'youTube') {
      setVisibleReactPlayer(true);
      setConected('Yes');
      setPlatformurl('https://youtu.be/' + meeting_id);
    } else {
      setPlatformurl(meeting_id);
      setVisibleReactPlayer(false);
      setConected('Yes');
    }
    return () => {
      setPlatformurl(null);
    };
  }, [ meeting_id, thereIsConnection, typeActivity ]);

  return (
    <>
      <div className='mediaplayer'>
        {conected == 'Yes' && visibleReactPlayer ? (
          <>
            {console.log('ESTE ES EL TIPO DE ACTIVIDAD', typeActivity)}
            <ReactPlayer
              style={{ aspectRatio: '16/9' }}
              muted={false}
              playing={true}
              loop={true}
              width='100%'
              height={'100%'}
              url={platformurl}
              controls={false}
            />
          </>
        ) : conected == 'Yes' ? (
          <>
            <iframe
              style={screens.xs ? { aspectRatio: '10/20' } : { aspectRatio: '16/9' }}
              width='100%'
              height='100%'
              src={platformurl}
              frameBorder='0'
              allow='autoplay; encrypted-media'
              allowFullScreen></iframe>
          </>
        ) : (
          <Spin />
        )}
      </div>
    </>
  );
}

export default memo(GcorePlayer);
