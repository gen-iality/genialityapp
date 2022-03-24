import { Card, Result, Button, Spin } from 'antd';
import ModalStepByStep from './ModalStepByStep';
import ManagerView from './ManagerView';
import { useTypeActivity } from '../../../context/typeactivity/hooks/useTypeActivity';
import { useContext, useEffect, useState } from 'react';
import AgendaContext from '../../../context/AgendaContext';

import InitialSVG from './components/svg/InitialSVG';

const objecKeys = {
  url: 'Video',
  meeting: 'reunión',
  vimeo: 'vimeo',
  youTube: 'Youtube',
  eviusMeet: 'EviusMeet',
  RTMP: 'Transmisión',
};

const InitialView = (props: any) => {
  const { toggleActivitySteps, selectedKey, previewKey, data } = useTypeActivity();
  const [loading, setLoading] = useState(true);
  const { typeActivity, meeting_id } = useContext(AgendaContext);

  useEffect(() => {
    if (props.tab !== '2') return;
    //OBTENER DETALLE DE ACTIVIDAD
    if (typeActivity === null) {
      setLoading(false);
    } else {
      toggleActivitySteps('initial', {
        openModal: false,
        disableNextButton: false,
        typeOptions: undefined,
        selectedKey: 'finish',
        previewKey: typeActivity,
        data: typeActivity !== 'url' ? meeting_id : 'urldevideo',
        buttonsTextNextOrCreate: '',
        buttonTextPreviousOrCancel: '',
      });
      //MIENTRAS CARGA LOS COMPONENTES
      setTimeout(() => setLoading(false), 500);
    }
  }, [props.tab]);

  const renderComponet = () => {
    switch (selectedKey) {
      case 'finish':
        return (
          <ManagerView type={objecKeys[previewKey]} activityName={props.activityName} activityId={props.activityId} />
        );
      default:
        return (
          <Card>
            <Result
              icon={<InitialSVG style={{ width: '255px', height: '277px' }} />}
              status='info'
              title='Todavía no has definido el tipo de actividad'
              extra={
                <Button onClick={() => toggleActivitySteps('type')} type='primary'>
                  Escoge un tipo de actividad
                </Button>
              }
            />
          </Card>
        );
    }
  };

  return (
    <>
      {console.log('FINAL DATA==>', selectedKey, previewKey, data)}
      <ModalStepByStep />
      {!loading ? renderComponet() : <Spin />}
    </>
  );
};

export default InitialView;
