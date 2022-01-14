import React, { useState } from 'react';
import { Modal, Result, Button, Divider, Typography, Space } from 'antd';
import withContext from '../../Context/withContext';
import { useIntl } from 'react-intl';
import { recordTypeForThisEvent } from '../events/Landing/helpers/thisRouteCanBeDisplayed';
import { UseEventContext } from '../../Context/eventContext';

const ModalNoRegister = (props) => {
  let cEvent = UseEventContext();
  const intl = useIntl();
  // Mensajes para evento privado y publico

  const msgEventPublic = '';
  const msgEventPrivate = intl.formatMessage({
    id: 'modal.no_register.msg_private',
    defaultMessage:
      'Este evento es privado, solo se puede acceder por invitación,  contacte al administrador del evento.',
  });

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
            {intl.formatMessage({
              id: 'modal.no_register.gotoevius',
              defaultMessage: 'Ver más eventos',
            })}
          </Button>
          {recordTypeForThisEvent(cEvent) !== 'PRIVATE_EVENT' && (
            <Button
              onClick={() => props.cHelper.handleChangeTypeModal('registerForTheEvent')}
              key='sign_up'
              type='primary'
              size='large'>
              {intl.formatMessage({
                id: 'modal.feedback.accept',
                defaultMessage: 'Aceptar',
              })}
            </Button>
          )}
        </Space>,
      ]}
      zIndex={1000}
      closable={true}
      visible={
        ((props.cHelper.typeModal == 'preregisterMessage' || props.cHelper.typeModal == 'loginSuccessNotRegister') &&
          props.cEvent?.value?.allow_register &&
          props.cEvent?.value?.visibility == 'PUBLIC') ||
        (!props.cEvent?.value?.allow_register &&
          props.cEvent?.value?.visibility == 'PRIVATE' &&
          props.cHelper.typeModal !== 'visitors' &&
          props.cEventUser?.status == 'LOADED' &&
          !props.cEventUser?.value)
      }>
      <Result
        status='warning'
        icon={null}
        title={
          props.cHelper.typeModal !== 'loginSuccessNotRegister' ? (
            <Typography.Title level={4}>
              {intl.formatMessage({
                id: 'modal.no_register.title',
                defaultMessage:
                  'Hola, tienes una cuenta activa con nosotros, pero esta actividad requiere otros detalles sobre ti.',
              })}
            </Typography.Title>
          ) : (
            <Typography.Title level={4} style={{ textAlign: 'left' }}>
              Cuenta creada correctamente
            </Typography.Title>
          )
        }
        subTitle={
          <Typography.Paragraph style={{ fontSize: '16px' }}>
            {recordTypeForThisEvent(cEvent) === 'PUBLIC_EVENT_WITH_REGISTRATION' && msgEventPublic}
            {recordTypeForThisEvent(cEvent) === 'PRIVATE_EVENT' && msgEventPrivate}
          </Typography.Paragraph>
        }
      />
    </Modal>
  );
};

export default withContext(ModalNoRegister);
