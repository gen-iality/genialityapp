import { Card, Result, Button } from 'antd';
import ModalStepByStep from './ModalStepByStep';
import ManagerView from './ManagerView';
import { useTypeActivity } from '../../../context/typeactivity/hooks/useTypeActivity';

/* import InitialSVG from './components/svg/InitialSVG'; */

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
              /* icon={<InitialSVG style={{ width: '150px', height: '150px' }} />} */
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
      {renderComponet()}
    </>
  );
};

export default InitialView;
