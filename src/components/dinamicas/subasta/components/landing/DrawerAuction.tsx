import React from 'react';
import { Card, Col, Drawer, Row, Tabs, Grid, Button, Space, Image, Typography, Skeleton } from 'antd';
import { UseEventContext } from '@/context/eventContext';
import HCOActividad from '@/components/events/AgendaActividadDetalle/HOC_Actividad';
import { CloseOutlined } from '@ant-design/icons';
import { DrawerAuctionProps } from '../../interfaces/auction.interface';
import ImageProduct from './ImageProduct';
const { useBreakpoint } = Grid;

export default function DrawerAuction({ openOrClose, setOpenOrClose, auction }: DrawerAuctionProps) {
  const cEvent = UseEventContext();
  const screens = useBreakpoint();
  return (
    <Drawer
      headerStyle={{
        padding: '1px 24px',
      }}
      bodyStyle={{
        backgroundImage: `url(${cEvent.value?.styles?.BackgroundImage})`,
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
        backgroundSize: 'cover',
        paddingTop: '5px',
        paddingBottom: '5px',
        paddingLeft: screens.xs ? '5px' : '24px',
        paddingRight: screens.xs ? '5px' : '24px',
      }}
      title={
        <Row style={{ display: 'flex' }} justify='end'>
          <Typography.Title style={{ display: 'fex', margin: '1px' }} level={2}>
            Evento: {auction?.name || 'Subasta'}
          </Typography.Title>
        </Row>
      }
      visible={openOrClose}
      closeIcon={
        <Space align='center' style={{ width: '100%' }} wrap>
          <CloseOutlined /> Cerrar
        </Space>
      }
      onClose={setOpenOrClose}
      width={'100vw'}
      destroyOnClose={true}>
      <Row gutter={[16, 8]} style={{}}>
        <Col xs={24} sm={24} md={24} lg={10} xl={10} xxl={10} style={{ height: '100%' }}>
          <Row gutter={[0, 8]}>
            <Col span={24}>
              <Card
                style={{ backgroundColor: 'transparent' }}
                bordered={false}
                bodyStyle={{
                  padding: '0px',
                  overflow: 'hidden',
                  borderRadius: '20px',
                }}>
                {/* @ts-ignore */}
                <HCOActividad isBingo={true} />
              </Card>
            </Col>
            <Col span={24}>
              <Card style={{ borderRadius: '20px' }} bordered={false} bodyStyle={{ padding: '0px 20px' }}>
                <Tabs defaultActiveKey='1' draggable style={{ width: '100%' }} tabBarStyle={{ margin: '0px' }}>
                  <Tabs.TabPane key='1' tab='Pujas'>
                    <Row justify='center'>
                      <Col span={24}></Col>
                    </Row>
                  </Tabs.TabPane>
                  <Tabs.TabPane key='2' tab='Historial de articulos'>
                    <Row>
                      <Col span={24}></Col>
                    </Row>
                  </Tabs.TabPane>
                </Tabs>
              </Card>
            </Col>
          </Row>
        </Col>
        <Col xs={24} sm={24} md={24} lg={14} xl={14} xxl={14} style={{}}>
          <Row gutter={[16, 16]} justify='center'>
            <Col xs={24} sm={24} md={24} lg={14} xl={14} xxl={14} style={{}}>
              <ImageProduct auction={auction} />
            </Col>
          </Row>
        </Col>
      </Row>
    </Drawer>
  );
}
