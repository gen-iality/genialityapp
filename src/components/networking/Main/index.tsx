import { Button, Col, Row, Tabs } from 'antd';
import React from 'react';
import Report from '../report';
import { UseEventContext } from '@/context/eventContext';
import { PlusCircleOutlined } from '@ant-design/icons';
import MeetingList from './components/MeetingList';
import MeetingForm from './components/MeetingForm';

export default function Networking() {
  const eventContext = UseEventContext();
  const eventId = eventContext?.idEvent;
  console.log(eventId);
  return (
    <Tabs defaultActiveKey={'1'}>
      <Tabs.TabPane tab='Agendar citas' key={1}>
      <MeetingForm/>
        <Row justify='end' wrap gutter={[8, 8]}>
          <Col>
            <Button type='primary' icon={<PlusCircleOutlined />} size='middle'>
              Agregar
            </Button>
          </Col>
        </Row>
        <Row justify='center' wrap gutter={[12, 12]}>
          <Col>
            <MeetingList/>
          </Col>
        </Row>
      </Tabs.TabPane>

      <Tabs.TabPane tab='Report de networking' key={2}>
        <Report props={eventId} />
      </Tabs.TabPane>
    </Tabs>
  );
}
