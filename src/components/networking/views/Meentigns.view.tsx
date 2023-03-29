import React, { useState } from 'react';
import { Button, Col, Row, Modal } from 'antd';
import { PlusCircleOutlined } from '@ant-design/icons';
import { NetworkingContext } from '../context/NetworkingContext';
import MeetingList from '../components/MeetingList';
import MeetingForm from '../components/MeetingForm';
import { useContext } from 'react';
import { IMeeting } from '../interfaces/Meetings.interfaces';
import CreateUserModal from '../components/modal-create-user/CreateUserModal';

export default function MeentignView() {
  const { meetings, modal, edicion, closeModal, openModal } = useContext(NetworkingContext);
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const orderByDate = (): IMeeting[] => {
    return meetings?.sort((a: IMeeting, b: IMeeting) => {
      const fechaA = new Date(a.start);
      const fechaB = new Date(b.start);
      return fechaA.getTime() - fechaB.getTime();
    });
  };
  const onClickAgregarUsuario = () => {
    closeModal();
    setCreateModalVisible(true);
  };
  const onCancelModalAgregarUsuario = () => {
    setCreateModalVisible(false);
    openModal();
  };
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
          visible={modal}
          title={edicion ? 'Editar reunión' : 'Agregar Reunión'}
          footer={false}
          onCancel={closeModal}
          okText={'Guardar'}>
          <Row justify='end'>
            <Button onClick={onClickAgregarUsuario} icon={<PlusCircleOutlined />}>Agregar participante</Button>
          </Row>

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
