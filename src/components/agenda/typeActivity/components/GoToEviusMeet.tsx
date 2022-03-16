import React from 'react';
import { Button, Card, Typography } from 'antd';

const GoToEviusMeet = () => {
  return (
    <Card bodyStyle={{ padding: '21' }} style={{ borderRadius: '8px' }}>
      <Card.Meta
        title={
          <Typography.Text style={{ fontSize: '20px' }} strong>
            Evius Meet
          </Typography.Text>
        }
        description={<Button type='primary'>Entrar para transmitir</Button>}
      />
    </Card>
  );
};

export default GoToEviusMeet;
