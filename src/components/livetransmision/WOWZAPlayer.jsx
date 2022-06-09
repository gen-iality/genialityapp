import { useContext, useEffect, useState } from 'react';
import ReactPlayer from 'react-player';
import { getLiveStream } from '../../adaptors/gcoreStreamingApi';
import VolumeOff from '@2fd/ant-design-icons/lib/VolumeOff';
import { Button, Spin } from 'antd';
import AgendaContext from '@/context/AgendaContext';
import { CurrentUserContext } from '@/context/userContext';
import { Grid } from 'antd';

const { useBreakpoint } = Grid;

function WOWZAPlayer({ meeting_id, thereIsConnection }) {
  const screens = useBreakpoint();
  const defaultVideo =
    'https://firebasestorage.googleapis.com/v0/b/eviusauth.appspot.com/o/evius%2FLoading2.mp4?alt=media&token=8d898c96-b616-4906-ad58-1f426c0ad807';

  const [ platformurl, setPlatformurl ] = useState(defaultVideo);
  const [ muted, setMuted ] = useState(false);
  const [ loopBackGround, setLoopBackGround ] = useState(false);
  const [ visibleReactPlayer, setVisibleReactPlayer ] = useState(false);
  const { typeActivity, activityEdit } = useContext(AgendaContext);
  const userContext = useContext(CurrentUserContext);
  //SE CREA ESTE ESTADO POR QUE SE NECESITA REFRESCAR ESTE COMPONENTE EN EL DETALLE DE LA ACTIVIDAD
  const [ conected, setConected ] = useState('No');
  const urlDefault =
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS4FLnQiNROZEVxb5XJ2yTan-j7TZKt-SI7Bw&usqp=CAU';
  //console.log('DATOOS PLAYER===>', meeting_id, thereIsConnection);
  console.log('11. WOWZA PLAYER===>', typeActivity);

  useEffect(() => {
    if (typeActivity === 'meeting') {
      console.log('100. INGRESA ACA===>');
      setVisibleReactPlayer(false);
      setConected('Yes');
      setPlatformurl(
        `https://stagingeviusmeet.netlify.app/?meetingId=${activityEdit}&rol=0&username=${userContext.value?.names}&email=${userContext.value?.email
        }&photo=${userContext.value?.picture || urlDefault}`
      );
    }
    //console.log('100. typeActivity=>', typeActivity, conected, meeting_id);
    if (!meeting_id) return;
    if (!thereIsConnection && ((typeActivity !== 'youTube' && typeActivity !== 'video') || !typeActivity)) {
      console.log('100. INGRESA ACA 1===>');
      setConected('Yes');
      setLoopBackGround(typeActivity === 'url' ? true : false);
      setPlatformurl(typeActivity !== 'url' ? defaultVideo : meeting_id);
      setMuted(typeActivity !== 'url' ? true : false);
      setVisibleReactPlayer(true);
    } else if (thereIsConnection && (typeActivity !== 'youTube' || !typeActivity)) {
      console.log('100. INGRESA ACA 2===>');
      let asyncfunction = async () => {
        setConected('Yes');
        setLoopBackGround(true);
        setPlatformurl('none');
        let live_stream = await getLiveStream(meeting_id);
        console.log('LIVE STREAM===>', live_stream);
        let url = live_stream.iframe_url;
        visibleReactPlayer && setVisibleReactPlayer(false);

        //console.log('100. URL==>', live_stream.hls_playlist_url);
        /** se hace uso de un TimeOut para dar tiempo a wowza de inicializar la playList para que no devuelva error 404 la primera vez que el origen 'eviusMeets' envie data */
        setTimeout(() => {
          const aditionalParameters = typeActivity !== 'url' ? '?muted=1&autoplay=1' : '';
          setPlatformurl(url + aditionalParameters);
          setMuted(true);
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
      setLoopBackGround(false);
      setConected('Yes');
    }
    return () => {
      setLoopBackGround(false);
      setPlatformurl(null);
      setMuted(false);
    };
  }, [ meeting_id, thereIsConnection, typeActivity ]);

  return (
    <>
      {/*console.log('10. TYPE ACTIVITY=====>', conected, visibleReactPlayer, typeActivity, meeting_id)*/}
      <div className='mediaplayer'>
        {/* { muted && conected !== 'No' && (
          <Button
            onClick={() => setMuted(false)}
            shape='circle'
            style={{
             
              position: 'absolute',
              top: 'auto',
              left: 'auto',
              zIndex: '500',
            }}
            icon={<VolumeOff />}
          />
        )} */}
        {conected == 'Yes' && visibleReactPlayer ? (
          <ReactPlayer
            style={{ aspectRatio: '16/9' }}
            muted={muted}
            playing={typeActivity !== 'url' ? true : false}
            loop={!loopBackGround}
            width='100%'
            height={'100%'}
            url={platformurl}
            controls={loopBackGround}
          />
        ) : conected == 'Yes' ? (
          <iframe
            style={screens.xs && typeActivity == 'meeting' ? { aspectRatio: '10/20' } : { aspectRatio: '16/9' }}
            width='100%'
            height={'100%'}
            src={platformurl}
            frameborder='0'
            allow={typeActivity == 'meeting' ? 'camera *;microphone *' : 'autoplay; encrypted-media'}
            allowfullscreen></iframe>
        ) : (
          <Spin />
        )}
      </div>
    </>
  );
}

export default React.memo(WOWZAPlayer);
