import { Button, Collapse, Drawer, DrawerProps, Space, Tooltip, Typography, Grid, Card, Row, Col, Spin } from 'antd';
import { useGetCertificatesByEvents } from '../hooks/useGetCertificatesByEvents';
import CertificatesByEventsAndUserList from './CertificatesByEventsAndUserList';
import CertificateOutlineIcon from '@2fd/ant-design-icons/lib/CertificateOutline';
import { CaretRightOutlined, CloseOutlined } from '@ant-design/icons';
import { getCorrectColor } from '@/helpers/utils';

const { useBreakpoint } = Grid;

interface Props extends DrawerProps {
  organizationId: string;
  eventUserId: string;
  onCloseDrawer: () => void;
  orgContainerBg?: string; 
  orgTextColor?: string; 
}

export const ModalCertificatesByOrganizacionAndUser = ({
  eventUserId,
  organizationId,
  onCloseDrawer,
  orgContainerBg,
  orgTextColor,
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
            Lista de certificados por evento
          </Typography.Title>
        </Space>
      }
      footer={false}
      width={screens.xs ? '100%' : '450px'}
      closable={false}
      onClose={onCloseDrawer}
      headerStyle={{ border: 'none', padding: 10 }}
      bodyStyle={{ padding: 5}}
      extra={
        <Tooltip placement='bottomLeft' title='Cerrar'>
          <Button icon={<CloseOutlined style={{ fontSize: 20 }} />} onClick={onCloseDrawer} type='text' />
        </Tooltip>
      }
      {...modalProps}>
      {isLoading && 
        <Row align='middle' justify='center' style={{height: '100%'}} >
          <Col>
            <Spin 
              size='large'
              tip={<Typography.Text strong>Cargando...</Typography.Text>}/>
          </Col>
        </Row>}
      {!isLoading && (
        <Space 
          direction='vertical' 
          style={{width: '100%', overflowY: 'auto', height: '90%'}}
          className='desplazar'
        >
          <Collapse 
            ghost
            defaultActiveKey={['0']} 
            bordered={false}
            expandIcon={({ isActive }) => 
            <CaretRightOutlined 
              rotate={isActive ? 90 : 0} 
            />}
          >
            {certificatesByEvents.map((certificateByEvent, index) => (
              <Collapse.Panel
                header={
                  <Typography.Text strong /* style={{color: orgTextColor}} */>
                    {certificateByEvent?.event?.name ?? 'Evento sin nombre'}
                  </Typography.Text>} 
                key={index}
              >
                <CertificatesByEventsAndUserList
                  eventUser={certificateByEvent.eventUser}
                  itemLayout='vertical'
                  eventsWithEventUser={eventsWithEventUser}
                  loading={isLoading}
                  dataSource={certificateByEvent.certificatesByEvents}
                />
              </Collapse.Panel>
            ))}
          </Collapse>
        </Space>
      )}
      {/* */}
    </Drawer>
  );
};
