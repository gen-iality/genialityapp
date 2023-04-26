import React from 'react';
import useGetConfigNetworking from './hooks/useGetConfigNetworking';
import { UseUserEvent } from '@/context/eventUserContext';
import ListEventUserWithContext from './landing.view';
import { Card, Col, Result, Row, Typography } from 'antd';

export default function networkingIndex(key: string) {
  const cUser = UseUserEvent();
  const eventId = cUser?.value?.event_id;
  const { globalConfig } = useGetConfigNetworking(eventId);
  if (globalConfig?.show) {
    return (<ListEventUserWithContext key={key} />)
  } else {
    return (<Row gutter={[16, 16]} justify='center' align='middle'>
      <Col span={23}>
        <Card bodyStyle={{padding: 0}} style={{borderRadius: 20}}>
          <Result
            status="403"
            title={<Typography.Text strong>¡Networking no se encuentra visible en este momento!</Typography.Text>}
            subTitle={<Typography.Text>Sí necesitas acceso, por favor comunicarse con el administrador.</Typography.Text>}
          />
        </Card>
      </Col>
    </Row>)
  }
}
