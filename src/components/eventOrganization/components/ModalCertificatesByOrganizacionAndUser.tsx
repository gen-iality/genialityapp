import { Button, Collapse, Drawer, DrawerProps, Space, Tooltip, Typography, Grid } from 'antd';
import { useGetCertificatesByEvents } from '../hooks/useGetCertificatesByEvents';
import CertificatesByEventsAndUserList from './CertificatesByEventsAndUserList';
import CertificateOutlineIcon from '@2fd/ant-design-icons/lib/CertificateOutline';
import { CloseOutlined } from '@ant-design/icons';

const { useBreakpoint } = Grid;

interface Props extends DrawerProps {
  organizationId: string;
  eventUserId: string;
  onCloseDrawer: () => void;
}

export const ModalCertificatesByOrganizacionAndUser = ({
  eventUserId,
  organizationId,
  onCloseDrawer,
  ...modalProps
}: Props) => {
  const { certificatesByEvents, eventsWithEventUser, eventUsers, isLoading } = useGetCertificatesByEvents(
    organizationId,
    eventUserId
  );
  const screens = useBreakpoint();

  //toDo: Validar el mobile para el width del drawer

  return (
    <Drawer
      title={
        <Space wrap size={5} style={{ marginTop: 4 }}>
          <CertificateOutlineIcon style={{ fontSize: '24px' }} />
          <Typography.Title level={5} style={{ marginTop: 4 }}>
            Lista de usuarios de la organización
          </Typography.Title>
        </Space>
      }
      footer={false}
      width={screens.xs ? '100%' : '450px'}
      closable={false}
      onClose={onCloseDrawer}
      headerStyle={{ border: 'none', padding: 10 }}
      extra={
        <Tooltip placement='bottomLeft' title='Cerrar'>
          <Button icon={<CloseOutlined style={{ fontSize: 20 }} />} onClick={onCloseDrawer} type='text' />
        </Tooltip>
      }
      {...modalProps}>
      {isLoading && <>Cargando...</>}
      {!isLoading && (
        <Collapse defaultActiveKey={['0']}>
          {certificatesByEvents.map((certificateByEvent, index) => (
            <Collapse.Panel header={certificateByEvent?.event?.name ?? 'Evento sin nombre'} key={index}>
              <CertificatesByEventsAndUserList
                eventUser={certificateByEvent.eventUser}
                itemLayout='vertical'
                eventsWithEventUser={eventsWithEventUser}
                loading={isLoading}
                dataSource={certificateByEvent.certificatesByEvents}
                style={{ overflowY: 'auto', height: '90%', padding: 0 }}
                className='desplazar'
              />
            </Collapse.Panel>
          ))}
        </Collapse>
      )}
      {/* */}
    </Drawer>
  );
};
