import React, { useState } from 'react';
import { Button, Col, Row, Modal } from 'antd';
import { PlusCircleOutlined } from '@ant-design/icons';
import { NetworkingContext } from '../context/NetworkingContext';
import MeetingList from '../components/MeetingList';
import MeetingForm from '../components/MeetingForm';
import { useContext } from 'react';
import CreateUserModal from '../components/modal-create-user/CreateUserModal';
import { useGetMeetings } from '../hooks/useGetMeetings';

export default function MeentignView() {
  const {
    modal,
    edicion,
    closeModal,
    openModal,
    onCancelModalAgregarUsuario,
    createModalVisible,
    setCreateModalVisible,
  } = useContext(NetworkingContext);
  const { meetings, loading } = useGetMeetings();

  const onOk = () => {
    setCreateModalVisible(false);
    openModal();
  };

  return (
    <>
      <CreateUserModal
        title={'Agregar usuario'}
        createModalVisible={createModalVisible}
        onCancelModalCreateUser={onCancelModalAgregarUsuario}
        onOk={onOk}
      />
      {modal && (
        <Modal
          style={createModalVisible ? { display: 'none' } : {}}
          visible={modal}
          title={edicion ? 'Editar reunión' : 'Agregar Reunión'}
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
            Crear cita
          </Button>
        </Col>
      </Row>
      <Row justify='center' wrap gutter={[0, 8]} /* style={{paddingTop: '10px'}} */>
        <Col span={24}>
          <MeetingList meentings={meetings} loading={loading} />
        </Col>
      </Row>
    </>
  );
}
