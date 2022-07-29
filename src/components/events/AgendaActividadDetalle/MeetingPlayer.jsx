import { useContext } from 'react';
import { CurrentUserContext } from '../../../context/userContext';
import { Grid } from 'antd';

const { useBreakpoint } = Grid;

function MeetingPlayer({ activity }) {

  const screens = useBreakpoint();

  const userContext = useContext(CurrentUserContext);

  const imageDefault = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS4FLnQiNROZEVxb5XJ2yTan-j7TZKt-SI7Bw&usqp=CAU';

  const eviusmeetUrl = `https://stagingeviusmeet.netlify.app/?meetingId=${activity._id}&rol=0&username=${userContext.value?.names}&email=${userContext.value?.email}&photo=${userContext.value?.picture || imageDefault}`;

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
