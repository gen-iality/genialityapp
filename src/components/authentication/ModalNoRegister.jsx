import React from 'react';
import { Modal, Result, Button, Divider, Typography, Space } from 'antd';
import withContext from '../../Context/withContext';

const ModalNoRegister = (props) => {
  // Mensajes para evento privado y prublico
  const msgEventPublic =
    'Este evento requiere que sus asistentes estén registrados para poder participar. Si esta no es su cuenta, puede intentar con otra presionando el botón de cerrar sesión.';
  const msgEventPrivate =
    'Este evento es privado, solo se puede acceder por invitación, Si esta no es su cuenta puede intentar con otra o contactar con el administrador del evento.';
  return (
    <Modal
      onCancel={() => console.log('cerrar')}
      width={400}
      bodyStyle={{ textAlign: 'center', paddingRight: '10px', paddingLeft: '10px' }}
      centered
      footer={[
        <Space wrap key={'options'}>
          <Button key='sign_off' type='text' size='large'>
            Cerrar sesión
          </Button>
          <Button
            onClick={() => props.cHelper.handleChangeTypeModal('registerForTheEvent')}
            key='sign_up'
            type='primary'
            size='large'>
            Registrarme
          </Button>
        </Space>,
      ]}
      zIndex={1000}
      closable={true}
      visible={props.cHelper.typeModal == 'preregisterMessage' || props.cHelper.typeModal == 'loginSuccessNotRegister'}>
      <Result
        status='warning'
        icon={null}
        title={
          props.cHelper.typeModal !== 'loginSuccessNotRegister' ? (
            <Typography.Title level={4} style={{ textAlign: 'left' }}>
              Cuenta no registrada al evento
            </Typography.Title>
          ) : (
            <Typography.Title level={4} style={{ textAlign: 'left' }}>
              Cuenta creada correctamente
            </Typography.Title>
          )
        }
        subTitle={
          <Typography.Paragraph level={5} style={{ textAlign: 'left' }}>
            {msgEventPublic}
          </Typography.Paragraph>
        }
      />
    </Modal>
  );
};

export default withContext(ModalNoRegister);
