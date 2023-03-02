import { useState } from 'react';
import { SmileOutlined } from '@ant-design/icons';
import { Result, Grid } from 'antd';
import { useHelper } from '@context/helperContext/hooks/useHelper';
import HeaderColumnswithContext from '../HeaderColumns';

const { useBreakpoint } = Grid;

const GenericActivity = () => {
  const { currentActivity } = useHelper();
  const screens = useBreakpoint();
  const [activityState, setactivityState] = useState('');

  return (
    <>
      <HeaderColumnswithContext isVisible activityState={activityState} />
      <Result icon={<SmileOutlined />} title="Puedes asignar un contenido audiovisual a esta lección" />
    </>
  );
};

export default GenericActivity;