import { Button, Modal } from 'antd';
import { CheckCircleOutlined, ExclamationCircleOutlined, StopOutlined } from '@ant-design/icons';
import { OrganizationApi } from '@/helpers/request';
import { DispatchMessageService } from '@/context/MessageService';
import { useEffect } from 'react';

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
export const editUserConfirmation = (membersAll, org, user, userData, fetchEventsStatisticsData) => {
    Modal.confirm({
      title: '¿Está seguro de editar la información de este usuario?',
      icon: <ExclamationCircleOutlined />,
      content: `Una vez ${
        membersAll[user]?.active ? 'deshabilitado' : 'habilitado'
      }, el usuario ${
        membersAll[user]?.active ? 'no' : 'sí'
      } podrá acceder al contenido de tu organización.`,
      okText: 'Editar',
      okType: 'primary',
      cancelText: 'Cancelar',
      async onOk() {
        // Cambia el estado `active` en `userData` según el estado actual del usuario
        userData.active = !membersAll[user]?.active;
  
        await disableUser({membersAll, org, user, userData, fetchEventsStatisticsData });
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
