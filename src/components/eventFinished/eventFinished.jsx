import React from 'react';
import { withRouter } from 'react-router-dom';
import { Result } from 'antd';
import EventFinishedimage from '../../notfound.png';

function EventFinished() {
  return (
    <Result
      icon={<img width='40%' src={EventFinishedimage} />}
      title='Este evento ha finalizado'
      //   subTitle='Lo sentimos, la página que está visitando no existe.'
    />
  );
}

export default withRouter(EventFinished);
