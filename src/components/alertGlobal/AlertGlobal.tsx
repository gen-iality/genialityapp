import React, { useEffect, useState } from 'react';
import { Alert } from 'antd';
import controllerInternetConnection from '@/Utilities/controllerInternetConnection';

interface messageOptions {
  warning?: string;
  success?: string;
}
interface propsOptions {
  icon?: React.ReactNode;
  message?: messageOptions | React.ReactNode;
  type: 'success' | 'info' | 'warning' | 'error';
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

const AlertGlobal = ({ icon, message, type, description, placement = 'top', action }: propsOptions) => {
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
              icon={icon}
              message={message!.success}
              type={'success'}
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
              icon={icon}
              message={message!.warning}
              type={type}
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

export default AlertGlobal;
