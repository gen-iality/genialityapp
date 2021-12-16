import { Modal, Result, Button } from 'antd';
import React from 'react';

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

const ModalFeedback = ({ status, title, description, setOpenOrCloseTheModalFeedback, openOrCloseTheModalFeedback }) => {
  // status -> warning, info, success, error
  status = status ? status : 'info';

  // title -> mensaje principal
  title = title ? title : '¡Ups! algo salió mal';

  // title -> mensaje principal
  description = description ? description : '';

  return (
    <Modal
      bodyStyle={{ textAlign: 'center', paddingRight: '10px', paddingLeft: '10px' }}
      centered
      footer={null}
      zIndex={1000}
      closable={true}
      visible={openOrCloseTheModalFeedback}
      onCancel={() => setOpenOrCloseTheModalFeedback(!openOrCloseTheModalFeedback)}>
      <Result
        status={status}
        title={title}
        subTitle={description}
        extra={[
          <Button type='primary' key='aceptar'>
            Aceptar
          </Button>,
          <Button key='registrarme'>Registrarme</Button>,
        ]}
      />
    </Modal>
  );
};

export default ModalFeedback;
