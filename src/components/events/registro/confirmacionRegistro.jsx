import React, { useState } from 'react';
import { message, Button, Row, Col, Checkbox } from 'antd';
import EviusReactQuill from '../../shared/eviusReactQuill';
import { EventsApi } from '../../../helpers/request';

function ConfirmacionRegistro(props) {
  console.log('props.event.validateEmail', props.event.validateEmail);
  //Se definen las variables de useState para enviar y obtener datos
  let [validateEmail, setValidateEmail] = useState(() => {
    if (props.event && props.event.validateEmail) {
      if (props.event.validateEmail === 'true' || props.event.validateEmail === true) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  });
  let [registrationMessage, setRegistrationMessage] = useState(
    props.event && props.event.registration_message ? props.event.registration_message : ''
  );

  if (!props.event) return 'Cargando ...';

  //funcion para guardar la inormación
  const saveData = async () => {
    let data = {
      registration_message: registrationMessage,
      validateEmail: validateEmail,
    };
    await EventsApi.editOne(data, props.event._id);
    message.success('Contenido guardado');
  };

  return (
    <>
      <h1>Mensaje Confirmacion Registro </h1>
      <p>El siguiente mensaje le llegara a las personas luego de haberse registrado al evento</p>
      <Row gutter={[0, 24]}>
        <Col span={12}>
          <EviusReactQuill data={registrationMessage} handleChange={(e) => setRegistrationMessage(e)} />
        </Col>
      </Row>
      <Row>
        {/* Se envia el valor a validEmail a useSate para usarla porteriormente en la funcion saveData */}
        <Checkbox
          defaultChecked={validateEmail}
          style={{ marginRight: '2%' }}
          onChange={(e) => setValidateEmail(e.target.checked)}
        />
        <label>Requerir la validación del correo antes de completar el registro</label>
      </Row>
      <Row>
        <Col span={12}>
          <Button type='primary' onClick={saveData}>
            Guardar
          </Button>
        </Col>
      </Row>
    </>
  );
}

export default ConfirmacionRegistro;
