import { Card, Col, Divider, Row, Typography } from 'antd';
import React from 'react';
import ConfigObservers from '../components/Configurations/ConfigObservers';
import TypeMeenting from '../components/Configurations/TypeMeenting';
import ConfigSpaces from '../components/Configurations/ConfigSpaces';

export default function Configuration() {
  return (
    <>
      <Row justify='center' /* align='middle' */ gutter={8} style={{ marginBottom: 10 }} wrap>
        <Col xs={24} sm={12} md={8} lg={8} xl={8} xxl={8}>
          <Card hoverable /* style={{ minHeight: 550 }} */>
            <Divider orientation='left'>
              <Typography.Title level={5}>Configuración de observadores</Typography.Title>
            </Divider>
            <ConfigObservers />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={8} xl={8} xxl={8}>
          <Card hoverable /* style={{ minHeight: 550 }} */>
            <Divider orientation='left'>
              <Typography.Title level={5}>Configuración de tipos</Typography.Title>
            </Divider>
            <TypeMeenting />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={8} xl={8} xxl={8}>
          <Card hoverable /* style={{ minHeight: 550 }} */>
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
