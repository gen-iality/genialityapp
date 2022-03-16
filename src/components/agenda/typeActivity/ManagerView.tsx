import React from 'react';
import { Row, Col } from 'antd';
import CardPreview from '../typeActivity/components/CardPreview';
import GoToEviusMeet from './components/GoToEviusMeet';
import TransmitionOptions from './components/TransmitionOptions';
import CardShareLinkEviusMeet from './components/CardShareLinkEviusMeet';
import CardParticipantRequests from './components/CardParticipantRequests';
import CardRTMP from './components/CardRTMP';
import CardStartTransmition from './components/CardStartTransmition';

const ManagerView = () => {
  return (
    <>
      <Row gutter={[16, 16]}>
        <Col span={10}>
          <CardPreview />
        </Col>
        <Col span={14}>
          <CardStartTransmition />
          <Row gutter={[16, 16]}>
            <Col span={24}>
              <GoToEviusMeet />
            </Col>
            <Col span={24}>
              <TransmitionOptions />
            </Col>
            <Col span={24}>
              <CardShareLinkEviusMeet />
            </Col>
            <Col span={24}>
              <CardParticipantRequests />
            </Col>
          </Row>
        </Col>
        <Col span={24}>
          <CardRTMP />
        </Col>
      </Row>
    </>
  );
};

export default ManagerView;
