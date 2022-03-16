import React from 'react';
import { Card, Result, Button } from 'antd';
/* import InitialSVG from './components/svg/InitialSVG'; */

const InitialView = () => {
  return (
    <Card>
      <Result
        /* icon={<InitialSVG style={{ width: '150px', height: '150px' }} />} */
        status='info'
        title='Todavía no has definido el tipo de actividad'
        extra={<Button type='primary'>Escoge un tipo de actividad</Button>}
      />
    </Card>
  );
};

export default InitialView;
