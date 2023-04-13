import { Card, Col, Divider, Row, Typography } from 'antd';
import React from 'react';
import ConfigObservers from '../components/Configurations/ConfigObservers';
import TypeMeenting from '../components/Configurations/TypeMeenting';
import ConfigSpaces from '../components/Configurations/ConfigSpaces';
import ConfigMeet from '../components/Configurations/ConfigMeet';


export default function Configuration() {
  return (
    <>
      <Row justify='start' gutter={[32, 32]} style={{ marginBottom: 10 }} wrap >
        <Col xs={22} sm={16} md={16} lg={12} xl={8} xxl={6}>
          <Card  hoverable style={{ height: 550, maxWidth: 600, backgroundColor: '#FDFEFE'}}>
            <Divider orientation='left'>
              <Typography.Title level={5}>Configuración de Meet</Typography.Title>
            </Divider>
            <ConfigMeet />
          </Card>
        </Col>
        <Col xs={22} sm={16} md={16} lg={12} xl={8} xxl={6}>
          <Card hoverable style={{ height: 550, maxWidth: 600, backgroundColor: '#FDFEFE'}}>
            <Divider orientation='left'>
              <Typography.Title level={5}>Configuración de observadores</Typography.Title>
            </Divider>
            <ConfigObservers />
          </Card>
        </Col>
        <Col xs={22} sm={16} md={16} lg={12} xl={8} xxl={6}>
          <Card hoverable style={{ height: 550, maxWidth: 600, backgroundColor: '#FDFEFE'}}>
            <Divider orientation='left'>
              <Typography.Title level={5}>Configuración de tipos</Typography.Title>
            </Divider>
            <TypeMeenting />
          </Card>
        </Col>
        <Col xs={22} sm={16} md={16} lg={12} xl={8} xxl={6}>
          <Card hoverable style={{ height: 550,  maxWidth: 600, backgroundColor: '#FDFEFE'}}>
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
