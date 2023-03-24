import { Button, Collapse, Space, Typography } from 'antd';
import React from 'react';
import ConfigObservers from '../components/Configurations/ConfigObservers';
import { CaretDownOutlined } from '@ant-design/icons';

export default function Configuration() {
  const data: any[] = [];
  return (
    <>
      <Collapse
        expandIcon={({ isActive }) => (<Button type='text' shape='circle' icon={<CaretDownOutlined rotate={isActive ? 180 : 0} />}></Button>)}
        bordered={true}
        style={{ backgroundColor: '#F9FAFE' }}>

        {/*panel de configuracion para los observadores en el calendario*/}
        <Collapse.Panel
          key='configuration observers'
          header={
            <Space style={{ userSelect: 'none' }}>
              <Typography.Text style={{ fontSize: '20px', fontWeight: '700', color: '#6F737C' }}>
                Configurar Observadores
              </Typography.Text>
            </Space>
          }>
          <ConfigObservers />
        </Collapse.Panel>

          {/* proximamente mas paneles de configuracion para el calendario y las reuniones*/}

      </Collapse>
    </>
  );
}
