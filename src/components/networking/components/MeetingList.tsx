import { Card, Col, Empty, Input, List, Row } from 'antd';
import React, { useState } from 'react';
import MeetingItem from './MeetingItem';
import { IMeetingList } from '../interfaces/Meetings.interfaces';

const { Search } = Input;

export default function MeetingList({ meentings, loading }: IMeetingList) {
  const [filter, setfilter] = useState('');

  const filterMeentings = () => {
    return meentings.filter((item) => item.name.toLowerCase().match(filter.toLowerCase()));
  };

  return (
    <Card headStyle={{ border: 'none' }} bodyStyle={{ padding: '15px' }}>
      { filterMeentings() && filterMeentings().length > 0 &&
        <Row gutter={8}>
          <Col span={12} style={{ marginBottom: 10 }}>
            <Search placeholder='Buscar la reunión' onChange={(e) => setfilter(e.target.value)} enterButton />
          </Col>
        </Row>
      }
      <List
        loading={loading}
        dataSource={filterMeentings()}
        pagination={filterMeentings() && filterMeentings().length > 10 && { pageSize: 10 }}
        renderItem={(meenting, key) => (
          <List.Item key={meenting.id}>
            <Col span={24} key={`meeting-item-${key}`}>
              <MeetingItem meenting={meenting} />
            </Col>
          </List.Item>
        )}
      />
    </Card>
  );
}
