import { Card, Col, Row } from 'antd';
import React from 'react';
import MeetingItem from './MeetingItem';
import { IMeetingList } from '../interfaces/meetings.interfaces';

export default function MeetingList({ meentings }: IMeetingList) {
 
  return (
    <Card headStyle={{ border: 'none' }} bodyStyle={{ paddingTop: '0px' }}>
      <Row gutter={[0, 16]}>
        {meentings.map((meenting, key) => (
          <Col key={key} span={24} >
            <MeetingItem key={key} menting={meenting} />
          </Col>
        ))}
      </Row>
    </Card>
  );
}
