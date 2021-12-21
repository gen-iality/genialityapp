import React from 'react';
import { Modal, Result, Button, Divider, Typography, Space } from 'antd';
import withContext from '../../Context/withContext';
import { useIntl } from 'react-intl';

const ModalNoRegister = (props) => {
  const intl = useIntl();
  // Mensajes para evento privado y prublico
  const msgEventPublic = 'Este evento requiere que los asistentes se registren para poder participar.';
  const msgEventPrivate =
    'Este evento es privado, solo se puede acceder por invitación, Si esta no es su cuenta puede intentar con otra o contactar con el administrador del evento.';
  return (
    <Modal
      onCancel={() => props.cHelper.handleChangeTypeModal('visitors')}
      bodyStyle={{ textAlign: 'center', paddingRight: '10px', paddingLeft: '10px' }}
      centered
      footer={[
        <Space wrap key={'options'}>
          <Button
            onClick={() => {
              window.location.href = `${window.location.origin}`;
            }}
            key='sign_off'
            type='text'
            size='large'>
            Ir a evius
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
            <Typography.Title level={4}>Usuario no registrado al evento</Typography.Title>
          ) : (
            <Typography.Title level={4}>Cuenta creada correctamente</Typography.Title>
          )
        }
        subTitle={<Typography.Paragraph style={{ fontSize: '16px' }}>{msgEventPublic}</Typography.Paragraph>}
      />
    </Modal>
  );
};

export default withContext(ModalNoRegister);
