import { Certificates } from '@/components/agenda/types';
import { CloseOutlined, DownloadOutlined } from '@ant-design/icons';
import { Alert, Button, Drawer, DrawerProps, Grid, Row, Space, Tooltip, Typography } from 'antd';
import { useGetEventUserWithCertificate } from '../hooks/useGetEventUserWithCertificate';
import { UsersByCertificatesList } from './UsersByCertificatesList';
import { generateCerts } from '../helpers/certificados.helper';
import CertificateOutlineIcon from '@2fd/ant-design-icons/lib/CertificateOutline';

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
          <CertificateOutlineIcon style={{fontSize: '20px'}} />
          <Typography.Title level={5} style={{ marginTop: 4 }}>
            Listado de usuarios con este certificado
          </Typography.Title>
        </Space>
      }
      footer={
        <Row justify='end'>
          <Button type='primary' onClick={onGenerateCertificates} icon={<DownloadOutlined />}>
            Descargar página actual
          </Button>
        </Row>
      }
      width={'450px'}
      closable={false}
      onClose={onCloseDrawer}
      headerStyle={{ border: 'none', padding: 10 }}
      /* bodyStyle={{ padding: 5 }} */
      extra={
        <Tooltip placement='bottomLeft' title='Cerrar'>
          <Button icon={<CloseOutlined style={{ fontSize: 20 }} />} onClick={onCloseDrawer} type='text' />
        </Tooltip>
      }
      {...drawerProps}>
        <Space 
          direction='vertical' 
          style={{width: '100%', overflowY: 'auto', height: '100%'}}
          className='desplazar'
        >
          <UsersByCertificatesList
            pagination={pagination}
            dataSource={userEventUserWithCertificate}
            loading={isLoading}
            certificate={certificate}
            eventValue={eventValue}
          />
        </Space>
    </Drawer>
  );
};
