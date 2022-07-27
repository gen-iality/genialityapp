import { useState } from 'react';
import ReactPlayer from 'react-player';
import { useHelper } from '../../../../context/helperContext/hooks/useHelper';
import HeaderColumnswithContext from '../HeaderColumns';

const VideoActivity = () => {
  let { currentActivity } = useHelper();

  const [activityState, setactivityState] = useState('');

  return (
    <>
      <HeaderColumnswithContext isVisible={true} activityState={activityState}/>
        <div className='mediaplayer' style={{ aspectRatio: '16/9' }}>
          <ReactPlayer
            style={{ objectFit: 'cover' }}
            width='100%'
            height='100%'
            url={currentActivity && currentActivity?.video}
            controls
          />
        </div>
    </>
  );
};

export default VideoActivity;