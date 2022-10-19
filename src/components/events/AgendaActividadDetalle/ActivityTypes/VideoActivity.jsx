import { useState, useEffect } from 'react';
import ReactPlayer from 'react-player';
import { useHelper } from '@context/helperContext/hooks/useHelper';
import HeaderColumnswithContext from '../HeaderColumns';

const VideoActivity = () => {

  let { currentActivity } = useHelper();
  const urlVideo = currentActivity?.video;

  const [activityState, setactivityState] = useState('');
  const [isItAnFrame, setIsItAnFrame] = useState(false);

  useEffect(() => {
    if(currentActivity.type.name === 'cargarvideo'){
      setIsItAnFrame(true);
    } else {
      setIsItAnFrame(false);
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
            src={urlVideo + '?muted=1&autoplay=0'}
            frameBorder='0'
            allow='autoplay; encrypted-media'
            allowFullScreen
            ></iframe>
          ) : (
          <ReactPlayer
            style={{ objectFit: 'cover' }}
            width='100%'
            height='100%'
            url={urlVideo}
            controls
          />
          )}
        </div>
    </>
  );
};

export default VideoActivity;