import React from 'react';
import { Form, Button, Row, Col, Input, Typography } from 'antd';
import { useHistory } from 'react-router-dom';
import { app } from 'helpers/firebase';
import { FormattedMessage } from 'react-intl';
import { UseEventContext } from '../../../Context/eventContext';

const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};
const { Text } = Typography;

function AnonymousEvenUserForm() {
  const history = useHistory();
  let cEvent = UseEventContext();

  const onFinish = (values) => {
    app
      .auth()
      .signInAnonymously()
      .then((user) => {
        app
          .auth()
          .currentUser.updateProfile({
            displayName: values.name,
            photoURL: 'https://example.com/jane-q-user/profile.jpg',
          })
          .then(async (respother) => {
            await app.auth().currentUser.reload();
            console.log('RESP OTHER==>', respother);
            /* app
              .auth()
              .currentUser.updateEmail(values.email)
              .then((resp) => {
                console.log('EMAIL VALUES==>', values.email);
                console.log('LOGIN ANONIMO', resp);
                setUserAnosimous({ ...values });
              })
              .catch((err) => console.log('ERROR==>', err));*/
          });
      });
  };

  return (
    <Form className='asistente-list' {...layout} name='basic' initialValues={{ remember: true }} onFinish={onFinish}>
      <Row justify='start' style={{ marginBottom: 15 }}>
        <Col>
          <Text type='secondary'>
            <FormattedMessage
              id='form.message.socialzone'
              defaultMessage='Registrate para participar en el chat de este evento'
            />
          </Text>
        </Col>
      </Row>

      <Form.Item label='Nombre' name='name' rules={[{ required: true, message: 'Ingrese su nombre' }]}>
        <Input />
      </Form.Item>

      <Form.Item label='Email' name='email' rules={[{ required: true, message: 'Ingrese su email' }]}>
        <Input />
      </Form.Item>

      <Form.Item wrapperCol={{ offset: 6, span: 18 }}>
        <Button htmlType='submit' onClick={() => history.push(`/landing/${cEvent.value._id}/tickets`)} type='primary'>
          {/*<FormattedMessage id='form.button.register' defaultMessage='Registrarme' />*/}
          Ingresar
        </Button>
      </Form.Item>
    </Form>
  );
}

export default AnonymousEvenUserForm;
