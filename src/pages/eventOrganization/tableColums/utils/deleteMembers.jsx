import { DispatchMessageService } from '@/context/MessageService';
import { OrganizationApi } from '@/helpers/request';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { Modal } from 'antd';
// import { useGetEventsStatisticsData } from './useGetOrganizations';
// const { fetchEventsStatisticsData} = useGetEventsStatisticsData()
export async function handleDeleteUser(org, user, fetchEventsStatisticsData) {
  try {
    DispatchMessageService({
      type: 'loading',
      key: 'loading',
      msj: ' Por favor espere mientras se borra la información...',
      action: 'show',
    });
    await OrganizationApi.deleteUser(org, user);
    fetchEventsStatisticsData()

    // window.location.reload();

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

export const deleteUserConfirmation = (org, user, fetchEventsStatisticsData) => {
  Modal.confirm({
    title: '¿Está seguro de eliminar la información?',
    icon: <ExclamationCircleOutlined />,
    content: 'Una vez eliminado, no lo podrá recuperar',
    okText: 'Borrar',
    okType: 'danger',
    cancelText: 'Cancelar',
    onOk() {
      handleDeleteUser(org, user, fetchEventsStatisticsData);
    },
  });
};
