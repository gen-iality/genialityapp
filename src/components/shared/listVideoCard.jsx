import { Card, Space } from 'antd';
import React, { Fragment } from 'react';
import VideoCard from './videoCard';

const listVideoCard = () => {
  return (
    <Fragment style={{ width: '100%' }}>
    <Card headStyle={{border:'none'}} title='Videos grabados'>
      <Space size='large' style={{ width: '100%', overflowX: 'auto', padding: '10px', margin: '10px' }}>
        <VideoCard />
        <VideoCard />
        <VideoCard />
        <VideoCard />
        <VideoCard />
        <VideoCard />
        <VideoCard />
        <VideoCard />
        <VideoCard />   
      </Space>
      </Card>
    </Fragment>
  );
};

export default listVideoCard;
