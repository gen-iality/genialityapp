import { useContext } from 'react';
import { CurrentUserContext } from '../../../context/userContext';
import { Grid } from 'antd';

const { useBreakpoint } = Grid;

function MeetingPlayer({ activity }) {

  const screens = useBreakpoint();

  const userContext = useContext(CurrentUserContext);

  const defaultVideo = 'https://firebasestorage.googleapis.com/v0/b/geniality-sas.appspot.com/o/public%2Fgeniality-loading-streaming.mp4?alt=media&token=97dc8cbf-dc80-477d-862c-6be0eeb11076';

  const eviusmeetUrl = `https://stagingeviusmeet.netlify.app/?meetingId=${activity._id}&rol=0&username=${userContext.value?.names}&email=${userContext.value?.email}&photo=${userContext.value?.picture || defaultVideo}`;

  return (
    <>
      <div className='mediaplayer'>
        <iframe
          style={{ aspectRatio: screens.xs ? '10/20' : '16/9' }}
          width='100%'
          height= {'100%'}
          allow='camera *;microphone *'
          frameborder='0'
          allowfullscreen
          src={eviusmeetUrl}>
        </iframe>
      </div>
  </>
  );
}

export default MeetingPlayer;
