import { message } from 'antd';
import PasswordAssistant from './PasswordAssistant';
import { EventsApi } from '@/helpers/request';

function SendChangePassword({ email }) {
  
    async function handleRecoveryPass(email) {
        try {
          let resp = await EventsApi.changePasswordUser(email, window.location.href);
          if (resp) {
            message.success(`Se ha enviado el correo de recuperación de contraseña a: ${email}`);
          }
        } catch (error) {
          message.error('Ocurrió un error al enviar el correo de recuperación de contraseña');
        }
      }
  

  return (
    <div>
     <PasswordAssistant onOk={() => handleRecoveryPass(email)} />
    </div>
  );
}

export default SendChangePassword;

