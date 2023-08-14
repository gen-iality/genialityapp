import { Drawer, DrawerProps } from 'antd';
import { useGetCertificatesByEvents } from '../hooks/useGetCertificatesByEvents';
import CertificatesByEventsAndUserList from './CertificatesByEventsAndUserList';

interface Props extends DrawerProps {
  eventsWithEventUser: { [key: string]: any }[];
}

export const ModalCertificatesByOrganizacionAndUser = ({ eventsWithEventUser, ...modalProps }: Props) => {
  const { certificatesByEvents, isLoading } = useGetCertificatesByEvents(eventsWithEventUser);
  //toDo: Validar el mobile para el width del drawer
  return (
    <Drawer title='Lista de usuarios de la organización' footer={false} destroyOnClose {...modalProps}>
        <CertificatesByEventsAndUserList
          itemLayout="vertical"
          eventsWithEventUser={eventsWithEventUser}
          loading={isLoading}
          dataSource={certificatesByEvents}
          style={{ marginTop: '10px', overflowY: 'auto' }}
        />
    </Drawer>
  );
};
