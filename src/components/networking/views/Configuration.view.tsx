import { Col, Row } from 'antd';
import React from 'react';
import ConfigObservers from '../components/Configurations/ConfigObservers';
import TypeMeenting from '../components/Configurations/TypeMeenting';
import ConfigSpaces from '../components/Configurations/ConfigSpaces';
import ConfigMeet from '../components/Configurations/ConfigMeet';

export default function Configuration() {
  return (
    <>
      <Row gutter={[16, 16]} wrap >
        <Col xs={24} sm={12} md={12} lg={8} xl={8} xxl={6}>
          <ConfigMeet />
        </Col>
        <Col xs={24} sm={12} md={12} lg={8} xl={8} xxl={6}>
          <ConfigObservers />
        </Col>
        <Col xs={24} sm={12} md={12} lg={8} xl={8} xxl={6}>
          <TypeMeenting />
        </Col>
        <Col xs={24} sm={12} md={12} lg={8} xl={8} xxl={6}>
          <ConfigSpaces />
        </Col>
      </Row>
    </>
  );
}
