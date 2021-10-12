import React from 'react';
import { Button, Card, message, Result, Space, Typography } from 'antd';

const ExploreEvents = () => {
  return (
    <Card
      style={{ borderRadius: '10px', border: '2px dashed #cccccc', cursor: 'pointer' }}
      bodyStyle={{ padding: '0px' }}>
      <Result icon={' '} title='No encontramos eventos en los que este registrado' extra={<Button size='large' type='primary'>Explorar eventos</Button>} />
    </Card>
  );
};

export default ExploreEvents;
