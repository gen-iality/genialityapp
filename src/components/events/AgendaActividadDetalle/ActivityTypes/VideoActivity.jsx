import { useState, useContext, useEffect } from 'react';
import ReactPlayer from 'react-player';
import { useHelper } from '../../../../context/helperContext/hooks/useHelper';
import AgendaContext from '@/context/AgendaContext';
import HeaderColumnswithContext from '../HeaderColumns';

const VideoActivity = () => {
  let { currentActivity } = useHelper();

  const [activityState, setactivityState] = useState('');
  const [processedURL, setProcessedURL] = useState(null);
  const [isItAnFrame, setIsItAnFrame] = useState(false);
  const { obtainUrl } = useContext(AgendaContext);

  useEffect(() => {
    try {
      const {
        urlVideo,
        visibleReactPlayer, // boolean, when the video is ok
      } = obtainUrl(currentActivity?.type.name, currentActivity?.video);
      console.debug('obtainUrl gets', urlVideo);
      setProcessedURL(urlVideo);
      setIsItAnFrame(!visibleReactPlayer);
    } catch (err) {
      console.error(err);
    }
  }, [currentActivity]);

  return (
    <>
      <HeaderColumnswithContext isVisible={true} activityState={activityState}/>
        <div className='mediaplayer' style={{ aspectRatio: '16/9' }}>
          {isItAnFrame ? (
            <iframe
            style={{ aspectRatio: '16/9' }}
            width='100%'
            src={processedURL + '?muted=1&autoplay=1'}
            frameBorder='0'
            allow='autoplay; encrypted-media'
            allowFullScreen
            ></iframe>
          ) : (
          <ReactPlayer
            style={{ objectFit: 'cover' }}
            width='100%'
            height='100%'
            url={processedURL}
            controls
          />
          )}
        </div>
    </>
  );
};

export default VideoActivity;