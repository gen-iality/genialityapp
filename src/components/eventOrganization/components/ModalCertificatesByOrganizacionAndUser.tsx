import { Drawer, DrawerProps } from 'antd';
import { useGetCertificatesByEvents } from '../hooks/useGetCertificatesByEvents';
import CertificatesByEventsAndUserList from './CertificatesByEventsAndUserList';

interface Props extends DrawerProps {
  organizationId: string;
  eventUserId: string;
}

export const ModalCertificatesByOrganizacionAndUser = ({ eventUserId, organizationId, ...modalProps }: Props) => {
  const { certificatesByEvents, eventsWithEventUser, eventUsers, isLoading } = useGetCertificatesByEvents(
    organizationId,
    eventUserId
  );
  //toDo: Validar el mobile para el width del drawer
  return (
    <Drawer title='Lista de usuarios de la organización' footer={false} destroyOnClose {...modalProps}>
      <CertificatesByEventsAndUserList
        eventUsers={eventUsers}
        itemLayout='vertical'
        eventsWithEventUser={eventsWithEventUser}
        loading={isLoading}
        dataSource={certificatesByEvents}
        style={{ marginTop: '10px', overflowY: 'auto' }}
      />
    </Drawer>
  );
};
