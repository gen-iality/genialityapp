import { MehOutlined } from '@ant-design/icons';
import { Result } from 'antd';
import React from 'react';

const feedback = (props) => {

  const image = props.image ||  <MehOutlined />
  const message = props.message || 'No hay datos'

  return (
    <div style={{ width: '100%', paddingTop: '20px' }}>
      <Result icon={image} title={message} />
    </div>
  );
};

export default feedback;
