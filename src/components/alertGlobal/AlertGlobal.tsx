import React from 'react';
import { Alert } from 'antd';

interface propsOptions {
  icon?: React.ReactNode;
  message: string | React.ReactNode;
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
  return (
    <Alert
      className='animate__animated animate__fadeInDown'
      style={placement === 'top' ? positionTop : positionBotton}
      icon={icon}
      message={message}
      type={type}
      description={description}
      banner
      showIcon
      closable
      action={action}
    />
  );
};

export default AlertGlobal;
