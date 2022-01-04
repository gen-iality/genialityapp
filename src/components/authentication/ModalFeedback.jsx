import { Modal, Result, Button, Typography } from 'antd';
import React from 'react';
import withContext from '../../Context/withContext';
import { useIntl } from 'react-intl';

/** Feedback login
 * Email no valido -> status: error
 * Password no valido -> status: error
 * Numero de telefono no valido -> status: error
 * Sesion iniciada -> status: success
 */

/** Feedback register
 * Email ya registrado -> status: warning
 * Numero de telefono ya registrado -> status: warning
 * Cuenta creada -> status: success
 */

const ModalFeedback = ({ cHelper, cEvent }) => {
  const intl = useIntl();

  // status -> warning, info, success, error
  let status = cHelper?.typeModal == 'loginSuccess' ? 'success' : cHelper?.typeModal == 'loginError' ? 'error' : 'info';

  // title -> mensaje principal
  let title =
    cHelper?.typeModal == 'loginSuccess'
      ? intl.formatMessage({
          id: 'modal.feedback.title.success',
          defaultMessage: 'Muy bien, ahora eres parte de la mejor plataforma de eventos.',
        })
      : cHelper?.typeModal == 'loginError'
      ? intl.formatMessage({ id: 'modal.feedback.title.error', defaultMessage: 'Correo electrónico ya en uso' })
      : '¡Ups! algo salió mal';

  let description =
    cHelper?.typeModal == 'loginSuccess' && cEvent.value != null
      ? intl.formatMessage({
          id: 'modal.feedback.description.success',
          defaultMessage:
            'El evento desea recolectar datos para brindarte una mejor experiencia, nosotros llenaremos la información que ya suministraste anteriormente para agilizar este proceso. ',
        })
      : cHelper?.typeModal == 'loginError'
      ? intl.formatMessage({
          id: 'modal.feedback.description.error',
          defaultMessage:
            'El evento desea recolectar datos para brindarte una mejor experiencia, nosotros llenaremos la información que ya suministraste anteriormente para agilizar este proceso. ',
        })
      : '';

  return (
    <Modal
      bodyStyle={{ textAlign: 'center', paddingRight: '10px', paddingLeft: '10px' }}
      centered
      footer={null}
      zIndex={1000}
      closable={true}
      visible={cHelper?.typeModal == 'loginSuccess' || cHelper?.typeModal == 'loginError'}
      onCancel={() => cHelper.handleChangeTypeModal(null)}>
      <Result
        status={status}
        title={<Typography.Title level={4}>{title}</Typography.Title>}
        subTitle={<Typography.Paragraph style={{ fontSize: '16px' }}>{description}</Typography.Paragraph>}
        extra={[
          <Button size='large' onClick={() => cHelper.handleChangeTypeModal(null)} type='primary' key='aceptar'>
            {intl.formatMessage({ id: 'modal.feedback.accept', defaultMessage: 'Aceptar' })}
          </Button>,
          cHelper?.typeModal !== 'loginError' && cHelper?.typeModal !== 'loginSuccess' && (
            <Button
              size='large'
              onClick={() => {
                cHelper.handleChangeTypeModal('registerForTheEvent');
              }}
              key='registrarme'>
              Registrarme
            </Button>
          ),
        ]}
      />
    </Modal>
  );
};

export default withContext(ModalFeedback);
