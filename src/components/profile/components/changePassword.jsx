import React, { useState } from 'react';
import { Form, Input, Button, Alert } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { useIntl } from 'react-intl';
import { EventsApi } from '../../../helpers/request';

export const ChangePassword = ({ email }) => {
  const [sendRecovery, setSendRecovery] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [passwordSentSuccessfullyOrWrongly, setpPsswordSentSuccessfullyOrWrongly] = useState('initial');

  const intl = useIntl();

  const handleRecoveryPass = async (values) => {
    setSendRecovery(null);
    setpPsswordSentSuccessfullyOrWrongly('initial');
    setIsLoading(true);
    setSendRecovery(
      `${intl.formatMessage({
        id: 'modal.restore.alert.passwordRequest',
        defaultMessage: 'Solicitando link de restablecimiento de contraseña.',
      })}`
    );
    setTimeout(async () => {
      try {
        await EventsApi.changePasswordUser(values.email);
        setIsLoading(false);
        setSendRecovery(
          `${intl.formatMessage({
            id: 'modal.restore.alert.passwordSuccess',
            defaultMessage: 'Se ha enviado una link de restablecimiento de contraseña a:',
          })} ${email} `
        );
        setpPsswordSentSuccessfullyOrWrongly(true);
      } catch (error) {
        setIsLoading(false);
        setpPsswordSentSuccessfullyOrWrongly(false);
        setSendRecovery(
          `${intl.formatMessage({
            id: 'modal.restore.alert.passwordError',
            defaultMessage: 'Error al solicitar el link de restablecimiento contraseña',
          })}`
        );
      }
    }, 1500);
  };

  return (
    <div>
      <Form onFinish={handleRecoveryPass} autoComplete='off' layout='vertical' style={{ padding: '100px' }}>
        <Form.Item
          label={'Email'}
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
            Restablecer contraseña
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};
export default ChangePassword;
