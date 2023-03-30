import { Card, Col, Input, Row } from 'antd';
import React, { useState } from 'react';
import MeetingItem from './MeetingItem';
import { IMeetingList } from '../interfaces/Meetings.interfaces';

const { Search } = Input;

export default function MeetingList({ meentings }: IMeetingList) {
  const [filter, setfilter] = useState('');

  const filterMeentings = () => {
    return meentings.filter((item) => item.name.toLowerCase().match(filter.toLowerCase()));
  };

  return (
    <Card headStyle={{ border: 'none' }} bodyStyle={{ padding: '15px' }}>
      <Col span={12} style={{ marginBottom: 10 }}>
        <Search placeholder='Buscar la reunión' onChange={(e)=>setfilter(e.target.value)} enterButton />
      </Col>
      <Row gutter={[0, 8]}>
        {filterMeentings().map((meenting, key) => (
          <Col span={24}>
            <MeetingItem meenting={meenting} />
          </Col>
        ))}
      </Row>
    </Card>
  );
}
