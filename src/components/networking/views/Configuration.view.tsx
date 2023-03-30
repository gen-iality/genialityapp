import {Card, Col, Divider, Layout, Row, Typography } from 'antd';
import React from 'react';
import ConfigObservers from '../components/Configurations/ConfigObservers';
import Meta from 'antd/lib/card/Meta';
import TypeMeenting from '../components/Configurations/TypeMeenting';

const {Content} = Layout;

export default function Configuration() {
  return (
    <Row justify='center' align='middle' gutter={8}>
      <Col span={12}>
        <Card
          hoverable
          /* style={{ width: 540 }} */
        >
          <Divider orientation='left'><Typography.Title level={5}>Configuración de observadores</Typography.Title></Divider>
          
          {/* <Meta title=''/> */}
          <ConfigObservers />
        </Card>
      </Col>
      <Col span={12}>
        <Card
          hoverable
          /* style={{ width: 540 }} */
        >
          <Divider orientation='left'><Typography.Title level={5}>Configuración de tipos</Typography.Title></Divider>
          
          {/* <Meta title=''/> */}
          <TypeMeenting />
        </Card>
      </Col>
      {/* <Content style={{ display: 'flex', justifyContent: 'space-around' , padding: 10}}>
        
      </Content> */}
    </Row>
  );
}
