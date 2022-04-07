import { notification } from 'antd';
import Logout from '@2fd/ant-design-icons/lib/Logout';
import { remoteLogoutNotificationInterface } from '../interfaces/interfaces';

/**
 * @function remoteLogoutNotification - Show notification after logging out remotely the user is notified why their current session has been logged out
 * @param {string} type Type of notification, success - info - warning - error
 * @param {string} userName Name of the user to log out
 * @param {function} formatMessage Function to change the message language
 */
export const remoteLogoutNotification = ({ type, userName, formatMessage }: remoteLogoutNotificationInterface) => {
  if (type == 'success' || type == 'warning' || type == 'error' || type == 'info')
    notification[type]({
      duration: 0,
      icon: (
        <Logout
          className='animate__animated animate__heartBeat animate__infinite animate__slower'
          style={{ color: '#FF4E50' }}
        />
      ),
      message: <b className='animate__animated animate__heartBeat animate__infinite animate__slower'>{userName}</b>,
      description: formatMessage({
        id: 'notification.log_out',
        defaultMessage: 'Tu sesión fue cerrada porque fue iniciada en otro dispositivo.',
      }),
      style: {
        borderRadius: '10px',
      },
    });

  return;
};
