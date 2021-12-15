import React from 'react';
import { Space } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

const Loading = () => {
  return (
    <Space
      direction='horizontal'
      style={{
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignContent: 'center',
        height: '100%',
      }}>
      <LoadingOutlined style={{ fontSize: '100px', color: '#cccccc' }} />
    </Space>
  );
};

export default Loading;
