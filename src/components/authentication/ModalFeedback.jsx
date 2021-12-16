import { Modal, Result, Button } from 'antd';
import React from 'react';
import withContext from '../../Context/withContext';

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

const ModalFeedback = ({ cHelper }) => {
  // status -> warning, info, success, error
  let status = cHelper.typeModal == 'loginSuccess' ? 'success' : cHelper.typeModal == 'loginError' ? 'error' : 'info';

  // title -> mensaje principal
  let title =
    cHelper.typeModal == 'loginSuccess'
      ? 'Correcto!'
      : cHelper.typeModal == 'loginError'
      ? 'Error'
      : '¡Ups! algo salió mal';

  // title -> mensaje principal
  let description =
    cHelper.typeModal == 'loginSuccess'
      ? 'Bienvenido a evius'
      : cHelper.typeModal == 'loginError'
      ? 'Ya se encuentra registrado. Por favor inicie sesión'
      : '';

  return (
    <Modal
      bodyStyle={{ textAlign: 'center', paddingRight: '10px', paddingLeft: '10px' }}
      centered
      footer={null}
      zIndex={1000}
      closable={true}
      visible={cHelper.typeModal == 'loginSuccess' || cHelper.typeModal == 'loginError'}
      onCancel={() => cHelper.handleChangeTypeModal(null)}>
      <Result
        status={status}
        title={title}
        subTitle={description}
        extra={[
          <Button onClick={() => cHelper.handleChangeTypeModal(null)} type='primary' key='aceptar'>
            Aceptar
          </Button>,
          cHelper.typeModal !== 'loginError' && cHelper.typeModal !== 'loginSuccess' && (
            <Button
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
