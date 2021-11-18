import React, { useContext, useState, useEffect } from 'react';
import WithEviusContext from '../../../Context/withContext';
import { HelperContext } from '../../../Context/HelperContext';
import { Result } from 'antd';

const ImageComponent = (props) => {
  let { currentActivity } = useContext(HelperContext);
  const [activityState, setactivityState] = useState('');

  useEffect(() => {
    setactivityState(currentActivity?.habilitar_ingreso);
  }, [currentActivity]);

  function RenderTextActivity(state) {
    console.log('que llega', state);
    switch (state) {
      case 'closed_meeting_room':
        return 'Esta actividad esta por iniciar';

      case '':
        return 'Esta actividad esta siendo configurada';

      default:
        break;
    }
  }

  let imagePlaceHolder = '';
  if (props.cEvent.value.styles.toolbarDefaultBg) {
    imagePlaceHolder =
      'https://via.placeholder.com/1500x540/' +
      props.cEvent.value.styles.toolbarDefaultBg.replace('#', '') +
      '/' +
      props.cEvent.value.styles.textMenu.replace('#', '') +
      '?text=' +
      props.cEvent.value.name;
  }

  return (
    <div className='column is-centered mediaplayer'>
      {props.cEvent.value.styles.toolbarDefaultBg != undefined || props.cEvent.value.styles.toolbarDefaultBg != '' ? (
        <img
          className='activity_image'
          style={{
            width: '100%',
            height: '60vh',
            objectFit: 'cover',
          }}
          src={
            props.cEvent.value.styles?.banner_image
              ? props.cEvent.value.styles?.banner_image
              : currentActivity?.image
              ? currentActivity?.image
              : props.cEvent.value.styles.event_image
              ? props.cEvent.value.styles.event_image
              : imagePlaceHolder
          }
          alt='Activity'
        />
      ) : (
        <Result title={RenderTextActivity(activityState)} />
      )}
    </div>
  );
};

let ImageComponentwithContext = WithEviusContext(ImageComponent);
export default ImageComponentwithContext;