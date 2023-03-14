import { Button, Col, Row, Tabs,Modal } from 'antd';
import React, { useState } from 'react';
import Report from '../report';
import { UseEventContext } from '@/context/eventContext';
import { PlusCircleOutlined } from '@ant-design/icons';
import MeetingList from './components/MeetingList';
import MeetingForm from './components/MeetingForm';

export default function Networking() {
  const [modal, setModal] = useState(false);

  const openModal = () => {
    setModal(true);
  };
  const closeModal = () => {
    setModal(false);
  };
  const eventContext = UseEventContext();
  const eventId = eventContext?.idEvent;
  console.log(eventId);
  return (
    <Tabs defaultActiveKey={'1'}>
      
      <Tabs.TabPane tab='Agendar citas' key={1}>
      {modal && (
								<Modal
									visible={modal}
									title={'Agregar Reunion'}
									footer={false}
									onCancel={closeModal}
									okText={'Guardar'}>
									<MeetingForm/>
								</Modal>
							)}
        <Row justify='end' wrap gutter={[8, 8]}>
          <Col>
            <Button type='primary' icon={<PlusCircleOutlined />} size='middle' onClick={openModal}>
              Agregar
            </Button>
          </Col>
        </Row>
        <Row justify='center' wrap gutter={[0, 16]}>
          <Col span={24}>
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
