
import { AttendeeApi, UsersApi } from '@/helpers/request';
import { DispatchMessageService } from '@/context/MessageService';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { Modal } from 'antd';

async function handleDeleteUser(user, activityId, event) {
  try {
    DispatchMessageService({
      type: 'loading',
      key: 'loading',
      msj: ' Por favor espere mientras se borra la información...',
      action: 'show',
    });


    activityId && await UsersApi.deleteAttendeeInActivity(activityId, user);
    
    !activityId && await AttendeeApi.delete(event, user);

    DispatchMessageService({
      key: 'loading',
      action: 'destroy',
    });
    DispatchMessageService({
      type: 'success',
      msj: 'Se eliminó la información correctamente!',
      action: 'show',
    });
  } catch (e) {
    DispatchMessageService({
      key: 'loading',
      action: 'destroy',
    });
    DispatchMessageService({
      type: 'error',
      msj: 'Error eliminando el usuario',
      action: 'show',
    });
  }
}

function deleteUserConfirmation(user, activityId, event) {
  Modal.confirm({
    title: `¿Está seguro de eliminar la información?`,
    icon: <ExclamationCircleOutlined />,
    content: 'Una vez eliminado, no lo podrá recuperar',
    okText: 'Borrar',
    okType: 'danger',
    cancelText: 'Cancelar',
    onOk() {
      handleDeleteUser(user, activityId, event);
    },
  });
}

export default deleteUserConfirmation;
