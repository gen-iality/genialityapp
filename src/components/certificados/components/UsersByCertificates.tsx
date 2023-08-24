import { Certificates } from '@/components/agenda/types';
import { CloseOutlined } from '@ant-design/icons';
import { Alert, Button, Drawer, DrawerProps, Grid, Space, Tooltip, Typography } from 'antd';
import { useGetEventUserWithCertificate } from '../hooks/useGetEventUserWithCertificate';
import { UsersByCertificatesList } from './UsersByCertificatesList';
import { generateCerts } from '../helpers/certificados.helper';

interface Props extends DrawerProps {
  onCloseDrawer: () => void;
  certificate: Certificates;
  eventValue: any;
}
const { useBreakpoint } = Grid;

export const UsersByCertificates = ({ onCloseDrawer, certificate, eventValue, ...drawerProps }: Props) => {
  const screens = useBreakpoint();
  const { userEventUserWithCertificate, isLoading, pagination } = useGetEventUserWithCertificate(
    certificate,
    certificate?.event_id ?? ''
  );

  const onGenerateCertificates = () => {
    const startIndex = (pagination.current - 1) * pagination.pageSize;
    const endIndex = startIndex + pagination.pageSize;
    return generateCerts(userEventUserWithCertificate.slice(startIndex, endIndex), certificate, eventValue);
  };

  return (
    <Drawer
      title={
        <Space wrap size={5} style={{ marginTop: 4 }}>
          <Typography.Title level={5} style={{ marginTop: 4 }}>
            Listado de usuarios con este certificado
          </Typography.Title>
        </Space>
      }
      footer={
        <Space>
          <Button type='primary' onClick={onGenerateCertificates}>
            Descargar pagina actual
          </Button>
        </Space>
      }
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
        pagination={pagination}
        dataSource={userEventUserWithCertificate}
        loading={isLoading}
        certificate={certificate}
        eventValue={eventValue}
      />
    </Drawer>
  );
};
