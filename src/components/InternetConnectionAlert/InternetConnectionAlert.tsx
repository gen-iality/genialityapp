import React, { useEffect, useState } from 'react';
import { Alert } from 'antd';
import controllerInternetConnection from '@/Utilities/controllerInternetConnection';
import { GlobalOutlined } from '@ant-design/icons';

interface propsOptions {
  description?: string | React.ReactNode;
  placement?: 'top' | 'bottom';
  action?: React.ReactNode;
}

const positionTop: React.CSSProperties = {
  position: 'fixed',
  top: '0',
  width: '100vw',
  zIndex: '2000',
};

const positionBotton: React.CSSProperties = {
  position: 'fixed',
  bottom: '0',
  width: '100vw',
  zIndex: '2000',
};

const InternetConnectionAlert = ({ description, placement = 'top', action }: propsOptions) => {
  const [connectionStatus, setConnectionStatus] = useState<boolean | string>('initial');

  controllerInternetConnection({ setConnectionStatus });

  useEffect(() => {
    if (connectionStatus === 'initial') return;
    if (connectionStatus === true) {
      setTimeout(() => {
        setConnectionStatus('initial');
      }, 3000);
    }
  }, [connectionStatus]);

  return (
    <>
      {typeof connectionStatus === 'boolean' && (
        <>
          {connectionStatus ? (
            <Alert
              key={'success'}
              className='animate__animated animate__fadeInDown'
              style={placement === 'top' ? positionTop : positionBotton}
              icon={<GlobalOutlined />}
              message='Conexión a internet restablecida.'
              type='success'
              description={description}
              showIcon
              // closable
              action={action}
            />
          ) : (
            <Alert
              key={'warning'}
              className='animate__animated animate__fadeInDown'
              style={placement === 'top' ? positionTop : positionBotton}
              icon={<GlobalOutlined />}
              message='Conexión a internet perdida.'
              type='error'
              description={description}
              showIcon
              // closable
              action={action}
            />
          )}
        </>
      )}
    </>
  );
};

export default InternetConnectionAlert;
