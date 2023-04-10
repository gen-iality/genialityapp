import { Card, Col, Divider, Row, Typography } from 'antd';
import React from 'react';
import ConfigObservers from '../components/Configurations/ConfigObservers';
import TypeMeenting from '../components/Configurations/TypeMeenting';
import ConfigSpaces from '../components/Configurations/ConfigSpaces';

export default function Configuration() {
  return (
    <>
      <Row justify='center' align='middle' gutter={8} style={{ marginBottom: 10 }}>
        <Col span={12}>
          <Card hoverable style={{ minHeight: 550 }}>
            <Divider orientation='left'>
              <Typography.Title level={5}>Configuración de observadores</Typography.Title>
            </Divider>

            {/* <Meta title=''/> */}
            <ConfigObservers />
          </Card>
        </Col>
        <Col span={12}>
          <Card hoverable style={{ minHeight: 550 }}>
            <Divider orientation='left'>
              <Typography.Title level={5}>Configuración de tipos</Typography.Title>
            </Divider>

            {/* <Meta title=''/> */}
            <TypeMeenting />
          </Card>
        </Col>
        {/* <Content style={{ display: 'flex', justifyContent: 'space-around' , padding: 10}}>
        
      </Content> */}
      </Row>
      <Row justify='center' align='middle' gutter={8}>
        <Col span={12}>
          <Card hoverable style={{ minHeight: 550 }}>
            <Divider orientation='left'>
              <Typography.Title level={5}>Configuración de espacios</Typography.Title>
            </Divider>

            {/* <Meta title=''/> */}
            <ConfigSpaces />
          </Card>
        </Col>
      </Row>
    </>
  );
}
