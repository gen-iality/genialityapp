import { Button, Card, Col, Row } from 'antd';
import React from 'react';
import MeetingItem from './MeetingItem';
import { IMeetingList } from '../interfaces/meetings.interfaces';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';

export default function MeetingList({ meentings }: IMeetingList) {
  const prueba = () =>{

  }
  return (
    <Card headStyle={{ border: 'none' }} bodyStyle={{ paddingTop: '0px' }}>
      <Row gutter={[0, 16]}>
        {meentings.map((meenting, key) => (
          <Col key={key} span={24} >
            <MeetingItem key={key} {...meenting} />
          </Col>
        ))}
      </Row>
    </Card>
  );
}
