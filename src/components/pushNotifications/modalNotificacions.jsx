import { Modal, Form, Input, Button, Typography, message } from 'antd';
import { SendOutlined } from '@ant-design/icons';
import axios from 'axios';

const { TextArea } = Input;

const ModalNotifications = (props) => {
  const [form] = Form.useForm();
  const { modalSendNotificationVisible, setModalSendNotificationVisible, data, eventName } = props;

  function resetFields() {
    form.resetFields();
  }

  async function sendNotifications(values) {
    const { notificationMessage } = values;
    const loading = message.loading({
      duration: 90,
      key: 'loading',
      content: `Enviando ${data.length > 0 ? 'notificaciones' : 'notificación'}`,
    });

    if (data.length > 0) {
      const promisesResolved = await Promise.all(
        data.map((item) => {
          const body = {
            token: item.token,
            title: `${eventName} dice: `,
            message: notificationMessage,
          };
          axios.post('https://eviusauth.web.app/notification', body);
          return true;
        })
      );

      if (promisesResolved) {
        message.destroy(loading.key);
        message.success('Notificación enviada correctamente');
        setModalSendNotificationVisible(false);
      }
    } else {
      const body = {
        token: data.token,
        title: `${eventName} dice: `,
        message: notificationMessage,
      };

      axios
        .post('https://eviusauth.web.app/notification', body)
        .then(function() {
          message.destroy(loading.key);
          message.success('Notificación enviada correctamente');
          setModalSendNotificationVisible(false);
        })
        .catch(function() {
          /** el catch tambien se maneja como successs ya que la notificacion siempre es enviada desde que exista un token, la unica diferencia es que cuando la pantalla del dispositivo esta apagada devuelve error 500 */
          message.destroy(loading.key);
          message.success('Notificación enviada correctamente');

          setModalSendNotificationVisible(false);
        });
    }
  }

  return (
    <Modal
      bodyStyle={{
        textAlign: 'center',
        paddingRight: '80px',
        paddingLeft: '80px',
        paddingTop: '80px',
        paddingBottom: '50px',
        height: 'auto',
      }}
      centered
      footer={null}
      zIndex={1000}
      closable={true}
      visible={modalSendNotificationVisible}
      onCancel={() => {
        setModalSendNotificationVisible(false);
        resetFields();
      }}>
      <Form onFinish={sendNotifications} form={form} autoComplete='off' layout='vertical'>
        <Typography.Title level={4} type='secondary'>
          Enviar notificación push
        </Typography.Title>
        <Form.Item
          label={'Mensaje'}
          name='notificationMessage'
          style={{ marginBottom: '10px' }}
          rules={[{ required: true, message: 'Ingrese un mensaje!' }]}>
          <TextArea rows={8} showCount maxLength={250} placeholder={'Máximo 250 caracteres'} />
        </Form.Item>
        <Form.Item style={{ marginBottom: '10px', marginTop: '30px' }}>
          <Button
            id={'submitButton'}
            htmlType='submit'
            block
            style={{ backgroundColor: '#52C41A', color: '#FFFFFF' }}
            size='large'
            icon={<SendOutlined />}>
            Enviar notificación
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ModalNotifications;
