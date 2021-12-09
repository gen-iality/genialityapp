import React from 'react';
import { Button, Drawer, Modal, Result, Typography } from 'antd';
import { CheckCircleTwoTone } from '@ant-design/icons';
import { ButtonPayment } from '../registrationForm/payRegister';

const ModalRegister = ({ register, setRegister, event }) => {
  let titleModal = register == 4 ? `¡Información Actualizada!` : `¡Registro Exitoso!`;

  let message =
    register == 1
      ? `Se ha mandado un correo de confirmación que te permitirá acceder al evento`
      : register == 2
      ? event?._id!=='617311a60cf67c7edd3d8022'? `Bienvenido al evento ${event?.name}.`.concat(event?._id=="61a8443fa3023d1c117f9e13"?" Recibirá en su correo el link de acceso al evento":""):`Estás listo para recargarte de ELECTRIC LOVE el próximo 10 de noviembre.`
      : register == 3 && `Su registro ha sido exitoso, click al siguiente enlace para realizar la donación`;
     // Recibirá en su correo el link de acceso al evento
  let infoButton =
    register == 1
      ? 'Cerrar'
      : register == 2
      ? `Disfrutar del evento`
      : register == 3
      ? `REGISTRO PAGO`
      : `Disfrutar del evento`;

  return (
    <Modal
      bodyStyle={{ textAlign: 'center', borderTop: '10px solid #52C41A' }}
      footer={null}
      zIndex={999999999}
      closable={false}
      visible={register !== null ? true : false}>
      <Result
        icon={event?._id=="61a8443fa3023d1c117f9e13"?<img style={{width:250,height:100}} src='https://firebasestorage.googleapis.com/v0/b/eviusauth.appspot.com/o/Icon_colsubsidio%2FLogoRecortado.png?alt=media&token=1c460c77-57ea-42ae-bdf3-e3a5d283ef7c'></img>:<CheckCircleTwoTone twoToneColor='#52c41a' />}
        status='success'
        title={<Typography.Text type='success'> {titleModal} </Typography.Text>}
        subTitle={<span style={{ fontSize: '18px' }}>{message}</span>}
        extra={[
          register != 3 ? (
            <Button
              onClick={() => setRegister(null)}
              style={{ backgroundColor: '#52C41A', color: '#FFFFFF', marginTop: '10px' }}
              size='large'
              key='console'>
              {infoButton}
            </Button>
          ) : (
            <ButtonPayment />
          ),
        ]}></Result>
    </Modal>
  );
};

export default ModalRegister;
