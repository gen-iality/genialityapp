import { LeftCircleOutlined } from '@ant-design/icons';
import { Modal, PageHeader, Space, Grid, Typography } from 'antd';
import React from 'react';
import FormComponent from '../events/registrationForm/form';

const { useBreakpoint } = Grid;

const stylePaddingDesktop = {
  paddingLeft: '25px',
  paddingRight: '25px',
};
const stylePaddingMobile = {
  paddingLeft: '10px',
  paddingRight: '10px',
};

const ModalPermission = (props) => {
  const screens = useBreakpoint();
  const textoTitle =
    props.typeModal == 'register' ? 'Registrarme al evento' : props.typeModal == 'update' ? 'Actualizar mis datos' : '';
  return (
    <Modal
      bodyStyle={{ textAlign: 'center', paddingRight: '10px', paddingLeft: '10px' }}
      centered
      footer={null}
      zIndex={999999999}
      closable={false}
      visible={true}>
      <PageHeader
        style={screens.xs ? stylePaddingMobile : stylePaddingDesktop}
        backIcon={
          <Space>
            <LeftCircleOutlined style={{ color: '#6B7283', fontSize: '20px' }} />
            <span style={{ fontSize: '14px', color: '#6B7283' }}>Volver al inicio de sesión</span>
          </Space>
        }
        onBack={() => null}
        title=' ' // NO eliminar el espacio en blanco
      />
      <div>
        <Typography.Title level={4} type='secondary'>
          {textoTitle}
        </Typography.Title>
      </div>
      <div
        // className='asistente-list'
        style={{
          height: '70vh',
          overflowY: 'hidden',
          paddingLeft: '5px',
          paddingRight: '5px',
          paddingTop: '8px',
          paddingBottom: '8px',
        }}>
        aqui va el form en modo registro o actualizacion
      </div>
    </Modal>
  );
};

export default ModalPermission;
