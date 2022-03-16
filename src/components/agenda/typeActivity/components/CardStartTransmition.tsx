import React, { useState } from 'react';
import { Card, Result, Space, Button } from 'antd';
import LoadingTypeActivity from './LoadingTypeActivity';

const CardStartTransmition = () => {
  const [loading, setloading] = useState(false);
  
  return (
    <Card bodyStyle={{ padding: '21' }} style={{ borderRadius: '8px' }}>
      { loading ? 
        <LoadingTypeActivity />
        :
        <Result
          title='Debes iniciar la transmisión'
          subTitle='Tus asistentes no verán lo que transmites hasta que cambies el estado de la transmisión para tus asistentes. '
          extra={
            <Space>
              <Button type='text' danger>
                Eliminar transmisión
              </Button>
              <Button type='primary'>Iniciar transmisión</Button>
            </Space>
          }
        />
      }
    </Card>
  );
};

export default CardStartTransmition;
