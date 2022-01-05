import React from 'react';
import { Result } from 'antd';

const RegistrationResult = ({ status, title }) => {
  let Status = status ? status : 'info';
  let Title = title ? title : 'algo paso';
  return <Result status={Status} title={Title} />;
};

export default RegistrationResult;
