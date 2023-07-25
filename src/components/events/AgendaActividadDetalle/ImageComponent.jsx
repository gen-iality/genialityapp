import { useState, useEffect } from 'react';
import WithEviusContext from '../../../context/withContext';
import { useHelper } from '../../../context/helperContext/hooks/useHelper';
import { Result } from 'antd';
import { ClockCircleOutlined, LoadingOutlined, SettingOutlined } from '@ant-design/icons';

const ImageComponent = (props) => {
  let { currentActivity } = useHelper();
  const [, setactivityState] = useState('');

  useEffect(() => {
    setactivityState(currentActivity?.habilitar_ingreso);
    return () => {
      setactivityState('');
    };
  }, [currentActivity]);

  const RenderTextActivity = (state) => {
    switch (state) {
      case 'created_meeting_room':
        return 'El contenido está siendo configurado para que puedas disfrutar de esta actividad.';
      case 'closed_meeting_room':
        return 'La actividad está por iniciar. ¡Prepárate para comenzar en breve!';
      default:
        return 'El contenido de esta actividad no esta cargada, disponible próximamente.';
    }
  };
  const getIcon = (state) => {
    switch (state) {
      case 'created_meeting_room':
        return <ClockCircleOutlined style={{ color: '#33FF93' }} />;
      case 'closed_meeting_room':
        return <LoadingOutlined style={{ color: '#33FF93' }} />;
      default:
        return <SettingOutlined />;
    }
  };
  return (
    <div className='mediaplayer'>
      {currentActivity ? (
        <Result icon={getIcon(currentActivity.habilitar_ingreso)} title={RenderTextActivity(currentActivity.habilitar_ingreso)} />
      ) : (
        <Result icon={getIcon('')} title={RenderTextActivity('')} />
      )}
    </div>
  );
};

let ImageComponentwithContext = WithEviusContext(ImageComponent);
export default ImageComponentwithContext;
