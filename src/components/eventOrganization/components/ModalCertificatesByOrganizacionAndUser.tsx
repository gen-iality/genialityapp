import { Button, Drawer, DrawerProps, Space, Tooltip, Typography, Grid } from 'antd';
import { useGetCertificatesByEvents } from '../hooks/useGetCertificatesByEvents';
import CertificatesByEventsAndUserList from './CertificatesByEventsAndUserList';
import CertificateOutlineIcon from '@2fd/ant-design-icons/lib/CertificateOutline';
import { CloseOutlined } from '@ant-design/icons';

const { useBreakpoint } = Grid;

interface Props extends DrawerProps {
  organizationId: string;
  eventUserId: string;
}

export const ModalCertificatesByOrganizacionAndUser = ({ eventUserId, organizationId, ...modalProps }: Props) => {
  const { certificatesByEvents, eventsWithEventUser, eventUsers, isLoading } = useGetCertificatesByEvents(
    organizationId,
    eventUserId
  );
  const screens = useBreakpoint();

  //toDo: Validar el mobile para el width del drawer
  return (
    <Drawer 
      title={
        <Space wrap size={5} style={{marginTop: 4}}>
          <CertificateOutlineIcon style={{ fontSize: '24px' }} />
          <Typography.Title level={5} style={{ marginTop: 4}}>Lista de usuarios de la organización</Typography.Title>
        </Space>
      }
      footer={false} 
      destroyOnClose {...modalProps}
      width={screens.xs ? '100%' : '450px'}
      closable={false}
      visible={modalProps.visible}
      headerStyle={{ border: 'none', padding: 10 }}
      extra={
        <Tooltip placement='bottomLeft' title='Cerrar'>
          <Button icon={<CloseOutlined style={{ fontSize: 20 }} />}/*  onClick={() => modalProps.onClose} */ type='text' />
        </Tooltip>
      }
    >
        <CertificatesByEventsAndUserList
          eventUsers={eventUsers}
          itemLayout="vertical"
          eventsWithEventUser={eventsWithEventUser}
          loading={isLoading}
          dataSource={certificatesByEvents}
          style={{ overflowY: 'auto', height: '90%', padding: 0 }}
          className='desplazar'
        />
    </Drawer>
  );
};
