import { Button, Col, Row, Tabs,Modal } from 'antd';
import React, { useState } from 'react';
import Report from '../report';
import { UseEventContext } from '@/context/eventContext';
import { PlusCircleOutlined } from '@ant-design/icons';
import MeetingList from './components/MeetingList';
import MeetingForm from './components/MeetingForm';
import { IMeeting } from './interfaces/meetings.interfaces';

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
  const dataPruebas : IMeeting[] = [
    {
      name  : 'prueba',
      place : 'barranquilla/la-victoria',
      date  : new Date(),
      participants : [
        {
          name : 'carlos',
          email : 'carloprueba@gmail.com',
          phone : '234992904',
          attendance : false
        },
        {
          name : 'luis',
          email : 'luisprueba@gmail.com',
          phone : '3223231212',
          attendance : false
        }
      ]
    }
  ]
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
									<MeetingForm cancel={closeModal}/>
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
            <MeetingList meentings={dataPruebas}/>
          </Col>
        </Row>
      </Tabs.TabPane>

      <Tabs.TabPane tab='Report de networking' key={2}>
        <Report props={eventId} />
      </Tabs.TabPane>

    </Tabs>
  );
}
