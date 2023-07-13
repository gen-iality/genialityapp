import { useState, useEffect } from 'react';
import WithEviusContext from '../../../context/withContext';
import { useHelper } from '../../../context/helperContext/hooks/useHelper';
import { Result, Spin } from 'antd';
import { ClockCircleOutlined, SettingOutlined } from '@ant-design/icons';

const ImageComponent = (props) => {
  let { currentActivity } = useHelper();
  const [activityState, setactivityState] = useState('');

  useEffect(() => {
    setactivityState(currentActivity?.habilitar_ingreso);
    return () => {
      setactivityState('');
    };
  }, [currentActivity]);

  const RenderTextActivity = (state) => {
    switch (state) {
      case 'created_meeting_room':
        return 'La configuración de esta actividad está en proceso. Por favor, espere mientras se realizan las configuraciones necesarias.';
      case 'closed_meeting_room':
        return 'Esta actividad está programada para iniciar pronto. ¡Prepárate para comenzar en breve!';
      default:
        return 'No se ha creado la actividad para este evento. Estamos trabajando en su configuración. Por favor, espera un momento.';
    }
  };
  const getIcon = (state) => {
    switch (state) {
      case 'created_meeting_room':
        return <ClockCircleOutlined style={{ color: '#33FF93' }} />;
      case 'closed_meeting_room':
        return <Spin />;
      default:
        return <SettingOutlined />;
    }
  };
  return (
    <div className='mediaplayer'>
      {props.cEvent.value.styles.toolbarDefaultBg !== undefined || props.cEvent.value.styles.toolbarDefaultBg !== '' ? (
        <Result icon={getIcon(activityState)} title={RenderTextActivity(activityState)} />
      ) : null}
    </div>
  );
};

let ImageComponentwithContext = WithEviusContext(ImageComponent);
export default ImageComponentwithContext;
