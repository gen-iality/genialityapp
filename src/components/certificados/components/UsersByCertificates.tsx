import { Certificates } from '@/components/agenda/types';
import { CloseOutlined } from '@ant-design/icons';
import { Button, Drawer, DrawerProps, Grid, Space, Tooltip, Typography } from 'antd';
import { useGetEventUserWithCertificate } from '../hooks/useGetEventUserWithCertificate';
import { UsersByCertificatesList } from './UsersByCertificatesList';

interface Props extends DrawerProps {
  onCloseDrawer: () => void;
  certificate: Certificates;
  eventValue: any;
}
const { useBreakpoint } = Grid;

export const UsersByCertificates = ({
  onCloseDrawer,
  certificate: certificates,
  eventValue,
  ...drawerProps
}: Props) => {
  const screens = useBreakpoint();
  const { userEventUserWithCertificate, isLoading } = useGetEventUserWithCertificate(
    certificates,
    certificates?.event_id ?? ''
  );
  return (
    <Drawer
      title={
        <Space wrap size={5} style={{ marginTop: 4 }}>
          <Typography.Title level={5} style={{ marginTop: 4 }}>
            Listado de usuarios con este certificado
          </Typography.Title>
        </Space>
      }
      footer={false}
      width={screens.xs ? '100%' : '450px'}
      closable={false}
      onClose={onCloseDrawer}
      headerStyle={{ border: 'none', padding: 10 }}
      bodyStyle={{ padding: 5 }}
      extra={
        <Tooltip placement='bottomLeft' title='Cerrar'>
          <Button icon={<CloseOutlined style={{ fontSize: 20 }} />} onClick={onCloseDrawer} type='text' />
        </Tooltip>
      }
      {...drawerProps}>
      <UsersByCertificatesList
        dataSource={userEventUserWithCertificate}
        loading={isLoading}
        certificate={certificates}
        eventValue={eventValue}
      />
    </Drawer>
  );
};
