import { useState } from 'react';
import { Row, Col, Checkbox, Form } from 'antd';
import EviusReactQuill from '../../shared/eviusReactQuill';
import { EventsApi } from '@helpers/request';
import Header from '@antdComponents/Header';
import { DispatchMessageService } from '@context/MessageService';

const formLayout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
};

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
    DispatchMessageService({
      type: 'loading',
      key: 'loading',
      msj: ' Por favor espere mientras se guarda el contenido...',
      action: 'show',
    });
    let data = {
      registration_message: registrationMessage,
      validateEmail: validateEmail,
    };
    try {
      await EventsApi.editOne(data, props.event._id);
      DispatchMessageService({
        key: 'loading',
        action: 'destroy',
      });
      DispatchMessageService({
        type: 'success',
        msj: 'Contenido guardada correctamente!',
        action: 'show',
      });
    } catch (e) {
      DispatchMessageService({
        key: 'loading',
        action: 'destroy',
      });
      DispatchMessageService({
        type: 'error',
        msj: e,
        action: 'show',
      });
    }
  };

  return (
    <>
      <Form onFinish={saveData} {...formLayout}>
        <Header
          title={'Confirmación de Inscripción'}
          description={'El siguiente mensaje le llegará a las personas inscritas en el curso o lección'}
          save
          form
        />
        <Row justify='center' wrap gutter={[8, 8]}>
          <Col span={18}>
            <Form.Item label={'Mensaje de Inscripción'}>
              <EviusReactQuill data={registrationMessage} handleChange={(e) => setRegistrationMessage(e)} />
            </Form.Item>
            {/* Removed by geniality/requirement-of-content: 'Configuración de inscripción' */}
            {/* <Form.Item label={'Requerir la validación del correo antes de completar la inscripción'}>
              <Checkbox defaultChecked={validateEmail} onChange={(e) => setValidateEmail(e.target.checked)} />
            </Form.Item> */}
          </Col>
        </Row>
      </Form>
      {/* <h1>Mensaje confirmacion registro</h1>
      <p>El siguiente mensaje le llegará a las personas inscritas en el curso o lección</p>
      <Row gutter={[0, 24]}>
        <Col span={12}>
          <EviusReactQuill data={registrationMessage} handleChange={(e) => setRegistrationMessage(e)} />
        </Col>
      </Row>
      <Row>
        Se envia el valor a validEmail a useSate para usarla porteriormente en la funcion saveData
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
      </Row> */}
    </>
  );
}

export default ConfirmacionRegistro;
