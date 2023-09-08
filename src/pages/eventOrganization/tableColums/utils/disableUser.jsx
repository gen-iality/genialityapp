/* eslint-disable no-console */
import { Modal } from 'antd';
import { CheckCircleOutlined, ExclamationCircleOutlined, StopOutlined } from '@ant-design/icons';
import { OrganizationApi } from '@/helpers/request';
import { DispatchMessageService } from '@/context/MessageService';

export async function disableUser({membersAll, org, user, userData, fetchEventsStatisticsData }) {
  try {
    DispatchMessageService({
      type: 'loading',
      key: 'loading',
      msj: 'Por favor espere mientras se edita la información...',
      action: 'show',
    });

    // Llama a la API para editar los datos del usuario
    await OrganizationApi.editUser(org, user, userData);

    // Vuelve a cargar los datos actualizados
    fetchEventsStatisticsData();

    DispatchMessageService({
      key: 'loading',
      action: 'destroy',
    });

    DispatchMessageService({
      type: 'success',
      msj: 'Se editó la información correctamente!',
      action: 'show',
    });
  } catch (e) {
    DispatchMessageService({
      key: 'loading',
      action: 'destroy',
    });

    DispatchMessageService({
      type: 'error',
      msj: 'Error editando el usuario',
      action: 'show',
    });
  }
}

// Función de confirmación para editar un usuario
export const editUserConfirmation = (membersAll, org, userId, userData, fetchEventsStatisticsData) => {
    const user = membersAll.find((member) => member._id === userId);
    if (!user) {
      // Manejar el caso en el que no se encuentra el usuario
      console.error(`Usuario con ID ${userId} no encontrado en membersAll`);
      return;
    }
    Modal.confirm({
      title: `¿Está seguro de ${
        user.active ? 'deshabilitar' : 'habilitar'
      } este usuario?`,
      icon: <ExclamationCircleOutlined />,
      content: `Una vez ${
        user.active ? 'deshabilitado' : 'habilitado'
      }, el usuario ${
        user.active ? 'no' : 'sí'
      } podrá acceder al contenido de tu organización.`,
      okText: 'Confirmar',
      okType: 'primary',
      cancelText: 'Cancelar',
      async onOk() {
        userData.active = !user.active;
        await disableUser({ membersAll, org, user: userId, userData, fetchEventsStatisticsData });
      },
    });
  };
  

// Función para obtener el ícono correcto en función del estado active
export const getIconForActiveState = (active) => {
    const iconStyle = {
        color: active ? 'green' : 'red', 
      };
  
    return active ? (
      <CheckCircleOutlined style={iconStyle} />
    ) : (
      <StopOutlined style={iconStyle} />
    );
  };
