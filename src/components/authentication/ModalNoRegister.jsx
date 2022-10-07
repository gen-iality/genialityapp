import { useState } from 'react';
import { Modal, Result, Button, Divider, Typography, Space } from 'antd';
import withContext from '@context/withContext';
import { useIntl } from 'react-intl';
import { recordTypeForThisEvent, iAmRegisteredInThisEvent } from '../events/Landing/helpers/thisRouteCanBeDisplayed';
import { UseEventContext } from '@context/eventContext';
import { UseUserEvent } from '@context/eventUserContext';

const ModalNoRegister = (props) => {
  let cEvent = UseEventContext();
  const cEventUser = UseUserEvent();
  const intl = useIntl();

  // Mensajes para curso privado
  const msgEventPrivate = intl.formatMessage({
    id: 'modal.no_register.msg_private',
    defaultMessage:
      'Este curso es privado, solo se puede acceder por invitación,  contacte al administrador del curso.',
  });

  function whenToOpenTheModal() {
    return (
      recordTypeForThisEvent(cEvent) === 'PRIVATE_EVENT' &&
      iAmRegisteredInThisEvent(cEventUser) === 'NOT_REGISTERED' &&
      props.cHelper.typeModal !== 'visitors'
    );
  }

  return (
    <Modal
      onCancel={() => {
        props.cHelper.handleChangeTypeModal('visitors');
      }}
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
            <b>
              {intl.formatMessage({
                id: 'modal.no_register.gotoevius',
                defaultMessage: 'Ver más cursos',
              })}
            </b>
          </Button>
        </Space>,
      ]}
      zIndex={1000}
      closable={true}
      visible={whenToOpenTheModal()}>
      <Result
        status='warning'
        icon={null}
        title={
          props.cHelper.typeModal !== 'loginSuccessNotRegister' ? (
            <Typography.Title level={4}>
              {recordTypeForThisEvent(cEvent) === 'PRIVATE_EVENT' && msgEventPrivate}
            </Typography.Title>
          ) : (
            <Typography.Title level={4} style={{ textAlign: 'left' }}>
              Cuenta creada correctamente
            </Typography.Title>
          )
        }
      />
    </Modal>
  );
};

export default withContext(ModalNoRegister);
