import { Card, Col, Divider, Row, Typography } from 'antd';
import React from 'react';
import ConfigObservers from '../components/Configurations/ConfigObservers';
import TypeMeenting from '../components/Configurations/TypeMeenting';
import ConfigSpaces from '../components/Configurations/ConfigSpaces';
import ConfigMeet from '../components/Configurations/ConfigMeet';

export default function Configuration() {
  return (
    <>
      <Row justify='center' gutter={[32, 32]} style={{ marginBottom: 10 }} wrap >
        <Col xs={24} sm={12} md={12} lg={6} xl={6} xxl={6}>
          <Card hoverable style={{height: '100%', backgroundColor: '#FDFEFE'}}>
            <Divider orientation='left'>
              <Typography.Title level={5}>Configuración de Meet</Typography.Title>
            </Divider>
            <ConfigMeet />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={12} lg={6} xl={6} xxl={6}>
          <Card hoverable style={{height: '100%', backgroundColor: '#FDFEFE'}}>
            <Divider orientation='left'>
              <Typography.Title level={5}>Configuración de observadores</Typography.Title>
            </Divider>
            <ConfigObservers />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={12} lg={6} xl={6} xxl={6}>
          <Card hoverable style={{height: '100%', backgroundColor: '#FDFEFE'}}>
            <Divider orientation='left'>
              <Typography.Title level={5}>Configuración de tipos</Typography.Title>
            </Divider>
            <TypeMeenting />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={12} lg={6} xl={6} xxl={6}>
          <Card hoverable style={{height: '100%', backgroundColor: '#FDFEFE'}}>
            <Divider orientation='left'>
              <Typography.Title level={5}>Configuración de espacios</Typography.Title>
            </Divider>
            <ConfigSpaces />
          </Card>
        </Col>
      </Row>
    </>
  );
}
