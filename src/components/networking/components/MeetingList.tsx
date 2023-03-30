import { Card, Col, Input, Row } from 'antd';
import React, { useState } from 'react';
import MeetingItem from './MeetingItem';
import { IMeetingList, IMeeting } from '../interfaces/Meetings.interfaces';
const { Search } = Input
export default function MeetingList({ meentings }: IMeetingList) {

  return (
    <Card headStyle={{ border: 'none' }} bodyStyle={{ paddingTop: '0px' }}>
      <Col span={12} style={{ margin: 10}}>
      <Search  placeholder="input search text" onSearch={(filter)=>{}} enterButton />
      </Col>
      <Row gutter={[0, 8]}>
        {meentings.map((meenting, key) => (
          <Col key={key} span={24} >
            <MeetingItem meenting={meenting} />
          </Col>
        ))}
      </Row>
    </Card>
  );
}
