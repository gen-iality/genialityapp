import React from 'react';
import { Button, Col, Row, Modal } from 'antd';
import { PlusCircleOutlined } from '@ant-design/icons';
import { NetworkingContext } from '../context/NetworkingContext';
import MeetingList from '../components/MeetingList';
import MeetingForm from '../components/MeetingForm';
import { useContext } from 'react';
import { IMeeting } from '../interfaces/Meetings.interfaces';

export default function MeentignView() {
  const { meetings, modal, edicion, closeModal, openModal } = useContext(NetworkingContext);

  const orderByDate = () : IMeeting[] => {
    return meetings.sort((a : IMeeting, b : IMeeting) => {
      const fechaA = new Date(a.start);
      const fechaB = new Date(b.start);
      return fechaA.getTime() - fechaB.getTime();
    });
  }
  
  return (
    <>
      {modal && (
        <Modal
          visible={modal}
          title={edicion ? 'Editar reunion' : 'Agregar Reunion'}
          footer={false}
          onCancel={closeModal}
          okText={'Guardar'}>
          <MeetingForm />
        </Modal>
      )}
      <Row justify='end' wrap gutter={8}>
        <Col>
          <Button
            style={{ marginBottom: 10 }}
            type='primary'
            icon={<PlusCircleOutlined />}
            size='middle'
            onClick={() => openModal()}>
            Agregar
          </Button>
        </Col>
      </Row>
      <Row justify='center' wrap gutter={[0, 16]} style={{paddingTop: '10px'}}>
        <Col span={24}>
          <MeetingList meentings={orderByDate()} />
        </Col>
      </Row>
    </>
  );
}
