import React from 'react';
import { Button, Drawer, Modal, Result, Typography } from 'antd';
import { CheckCircleTwoTone } from '@ant-design/icons';

const ModalRegister = ({ register, setRegister, event }) => {
  let message =
    register == 1
      ? `Se ha mandado un correo de confirmación que te permitirá acceder al evento`
      : register == 2
      ? `Bienvenido al evento ${event?.name}`
      : register == 3 && `Registro pago`;

  let infoButton = register == 1 ? 'Cerrar' : register == 2 ? `Disfrutar del evento` : register == 3 && `REGISTRO PAGO`;

  console.log('Registro', register);
  console.log('Mensaje', message);
  return (
    <Modal
      bodyStyle={{ textAlign: 'center', borderTop: '10px solid #52C41A' }}
      footer={null}
      zIndex={999999999}
      closable={false}
      visible={register !== null ? true : false}>
      <Result
        icon={<CheckCircleTwoTone twoToneColor='#52c41a' />}
        status='success'
        title={<Typography.Text type='success'>¡Registro Exitoso!</Typography.Text>}
        subTitle={<span style={{ fontSize: '18px' }}>{message}</span>}
        extra={[
          <Button
            onClick={() => setRegister(null)}
            style={{ backgroundColor: '#52C41A', color: '#FFFFFF', marginTop: '10px' }}
            size='large'
            key='console'>
            {infoButton}
          </Button>,
        ]}></Result>
    </Modal>
  );
};

export default ModalRegister;
