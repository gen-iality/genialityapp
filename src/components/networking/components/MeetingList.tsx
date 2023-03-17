import { Card, Col, Input, Row } from 'antd';
import React from 'react';
import MeetingItem from './MeetingItem';
import { IMeetingList } from '../interfaces/Meetings.interfaces';
const { Search } = Input
export default function MeetingList({ meentings }: IMeetingList) {
 
  return (
    <Card headStyle={{ border: 'none' }} bodyStyle={{ paddingTop: '0px' }}>
     <Search  placeholder="input search text" onSearch={()=>{}} enterButton />
      <Row gutter={[0, 16]}>
        {meentings?.map((meenting, key) => (
          <Col key={key} span={24} >
            <MeetingItem key={meenting.dateUpdated} meenting={meenting} />
          </Col>
        ))}
      </Row>
    </Card>
  );
}
