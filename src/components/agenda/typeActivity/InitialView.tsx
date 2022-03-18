import React from 'react';
import { Card, Result, Button } from 'antd';
import ModalStepByStep from './ModalStepByStep';
import ManagerView from './ManagerView';
import { useTypeActivity } from '../../../context/typeactivity/hooks/useTypeActivity';

/* import InitialSVG from './components/svg/InitialSVG'; */

const InitialView = (props: any) => {
  const { selectActivitySteps } = useTypeActivity();

  return (
    <>
      <ModalStepByStep />
      {/* <ManagerView /> */}
      <Card>
        <Result
          /* icon={<InitialSVG style={{ width: '150px', height: '150px' }} />} */
          status='info'
          title='Todavía no has definido el tipo de actividad'
          extra={
            <Button onClick={() => selectActivitySteps('type')} type='primary'>
              Escoge un tipo de actividad
            </Button>
          }
        />
      </Card>
    </>
  );
};

export default InitialView;
