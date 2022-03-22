import { useState } from 'react';
import { Form, Input, Button, Alert, Card, PageHeader, Typography } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { useIntl } from 'react-intl';
import { EventsApi } from '../../../helpers/request';
import ShieldLockIcon from '@2fd/ant-design-icons/lib/ShieldLock';

export const ChangePassword = ({ email }) => {
  const [sendRecovery, setSendRecovery] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [passwordSentSuccessfullyOrWrongly, setPsswordSentSuccessfullyOrWrongly] = useState('initial');

  const intl = useIntl();

  const handleRecoveryPass = async (values) => {
    setSendRecovery(null);
    setPsswordSentSuccessfullyOrWrongly('initial');
    setIsLoading(true);
    setSendRecovery(
      `${intl.formatMessage({
        id: 'modal.restore.alert.passwordRequest',
        defaultMessage: 'Solicitando link de cambio de contraseña.',
      })}`
    );
    setTimeout(async () => {
      try {
        await EventsApi.changePasswordUser(values.email);
        setIsLoading(false);
        setSendRecovery(
          `${intl.formatMessage({
            id: 'modal.restore.alert.passwordSuccess',
            defaultMessage: 'Se ha enviado una link de cambio de contraseña al correo:',
          })} ${email} `
        );
        setPsswordSentSuccessfullyOrWrongly(true);
      } catch (error) {
        setIsLoading(false);
        setPsswordSentSuccessfullyOrWrongly(false);
        setSendRecovery(
          `${intl.formatMessage({
            id: 'modal.restore.alert.passwordError',
            defaultMessage:
              'Error al solicitar el link de cambio contraseña Se ha producido un error al procesar su solicitud de cambio de contraseña.',
          })}`
        );
      }
    }, 1500);
  };

  return (
    <Card style={{ borderRadius: '15px' }}>
      <ShieldLockIcon
        style={{ position: 'absolute', right: '10px', bottom: '10px', fontSize: '50px', color: '#D0EFC1' }}
      />
      <PageHeader
        // avatar={{
        //   icon: <LockOutlined />,
        //   style: { backgroundColor: '#52C41A' },
        // }}
        title='Cambiar contraseña'
      />
      <div style={{ padding: '24px' }}>
        <Typography.Paragraph type='success' style={{ fontSize: '15px' }}>
          Puede solicitar un cambio de contraseña haciendo clic en el botón &quot;Solicitar cambio&quot;. Le enviaremos
          un correo electrónico con instrucciones sencillas.
        </Typography.Paragraph>
        <Form onFinish={handleRecoveryPass} autoComplete='off' layout='vertical'>
          <Form.Item
            label={'Este es el correo electrónico que recibirá la notificación'}
            name='email'
            initialValue={email}
            style={{ marginBottom: '10px', textAlign: 'left' }}>
            <Input type='text' size='large' disabled />
          </Form.Item>
          {sendRecovery !== null && (
            <Alert
              type={
                passwordSentSuccessfullyOrWrongly === 'initial'
                  ? 'info'
                  : passwordSentSuccessfullyOrWrongly
                  ? 'success'
                  : 'error'
              }
              message={sendRecovery}
              showIcon
              closable
              className='animate__animated animate__pulse'
              style={{
                boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
                backgroundColor: '#FFFFFF',
                color: '#000000',
                borderLeft: `5px solid ${
                  passwordSentSuccessfullyOrWrongly === 'initial'
                    ? '#333F44'
                    : passwordSentSuccessfullyOrWrongly
                    ? '#52C41A'
                    : '#FF4E50'
                }`,
                fontSize: '14px',
                textAlign: 'start',
                borderRadius: '5px',
              }}
              icon={isLoading && <LoadingOutlined />}
            />
          )}
          <Form.Item style={{ marginBottom: '10px', marginTop: '30px' }}>
            <Button htmlType='submit' style={{ backgroundColor: '#52C41A', color: '#FFFFFF' }} size='large'>
              Solicitar cambio
            </Button>
          </Form.Item>
        </Form>
      </div>
    </Card>
  );
};
export default ChangePassword;
