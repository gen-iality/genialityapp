/* eslint-disable no-console */
import { Modal } from 'antd';
import { CheckCircleOutlined, ExclamationCircleOutlined, StopOutlined } from '@ant-design/icons';
import { OrganizationApi } from '@/helpers/request';
import { DispatchMessageService } from '@/context/MessageService';

export async function disableUser({ org, user, userData, fetchEventsStatisticsData }) {
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
  const userActive = user.active !== undefined ? user.active : true;
  const actionText = userActive ? 'deshabilitar' : 'habilitar';
  const contentText = `Una vez ${actionText}, el usuario ${
    userActive ? 'no' : 'sí'
  } podrá acceder al contenido de tu organización.`;

  Modal.confirm({
    title: `¿Está seguro de ${actionText} este usuario?`,
    icon: <ExclamationCircleOutlined />,
    content: contentText,
    okText: 'Confirmar',
    okType: 'primary',
    cancelText: 'Cancelar',
    async onOk() {
      userData.active = !userActive;
      await disableUser({ membersAll, org, user: userId, userData, fetchEventsStatisticsData });
    },
  });
};

// Función para obtener el ícono correcto en función del estado active
export const getIconForActiveState = (active) => {
  const isActive = active || active === undefined;
  const iconStyle = {
    color: isActive ? 'green' : 'red',
  };

  return isActive ? <CheckCircleOutlined style={iconStyle} /> : <StopOutlined style={iconStyle} />;
};
