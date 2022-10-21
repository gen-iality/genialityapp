import { Form, Button, Row, Col, Input, Typography } from 'antd';
import { useHistory } from 'react-router-dom';
import { app } from '@helpers/firebase';
import { FormattedMessage } from 'react-intl';
import { useEventContext } from '@context/eventContext';
import { useUserEvent } from '@context/eventUserContext';
import { AttendeeApi } from '@helpers/request';

const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};
const { Text } = Typography;

function AnonymousEvenUserForm() {
  const history = useHistory();
  const cEvent = useEventContext();
  const cEventUser = useUserEvent();

  const onFinish = (values) => {
    const { name, email } = values;

    app
      .auth()
      .signInAnonymously()
      .then((user) => {
        app
          .auth()
          .currentUser.updateProfile({
            displayName: name,
            /**almacenamos el email en el photoURL para poder setearlo en el context del usuario y asi llamar el eventUser anonimo */
            photoURL: email,
          })
          .then(async () => {
            const body = {
              event_id: cEvent.value._id,
              uid: user.user.uid,
              anonymous: true,
              properties: {
                email: email,
                names: name,
              },
            };
            await app.auth().currentUser.reload();
            await AttendeeApi.create(cEvent.value._id, body);
            cEventUser.setUpdateUser(true);
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
              defaultMessage='Registrate para participar en el chat de este curso'
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
        <Button htmlType='submit' type='primary'>
          {/*<FormattedMessage id='form.button.register' defaultMessage='Registrarme' />*/}
          Ingresar
        </Button>
      </Form.Item>
    </Form>
  );
}

export default AnonymousEvenUserForm;
