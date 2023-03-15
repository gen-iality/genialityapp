import { Button, Col, Row, Modal } from 'antd';
import React, { useState } from 'react';
import { PlusCircleOutlined } from '@ant-design/icons';
import MeetingList from '../components/MeetingList';
import MeetingForm from '../components/MeetingForm';
import { IMeeting, typeAttendace } from '../interfaces/meetings.interfaces';
import { useContext } from 'react';
import { NetworkingContext } from '../context/NetworkingContext';

export default function Meentign() {
  const { 
    meetings, 
    modal,
    edicion, 
    closeModal , 
    openModal  } = useContext(NetworkingContext);



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
      <Row justify='end' wrap gutter={[8, 8]}>
        <Col>
          <Button style={{marginBottom:10}} type='primary' icon={<PlusCircleOutlined />} size='middle' onClick={() => openModal()}>
            Agregar
          </Button>
        </Col>
      </Row>
      <Row justify='center' wrap gutter={[0, 16]}>
        <Col span={24}>
          <MeetingList meentings={meetings} />
        </Col>
      </Row>
    </>
  );
}
