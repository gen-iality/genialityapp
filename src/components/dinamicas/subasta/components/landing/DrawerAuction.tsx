import React, { useState } from 'react';
import {
  Card,
  Col,
  Drawer,
  Row,
  Tabs,
  Grid,
  Button,
  Space,
  Typography,
  Skeleton,
  List,
  Avatar,
  Input,
  Form,
  Statistic,
  notification,
} from 'antd';
import { UseEventContext } from '@/context/eventContext';
import HCOActividad from '@/components/events/AgendaActividadDetalle/HOC_Actividad';
import { CloseOutlined } from '@ant-design/icons';
import { DrawerAuctionProps } from '../../interfaces/auction.interface';
import CardProduct from './CardProduct';
import { useBids } from '../../hooks/useBids';
import { saveOffer } from '../../services';
import useProducts from '../../hooks/useProducts';
import { TabsDrawerAuction } from '../../utils/utils';

const { useBreakpoint } = Grid;

export default function DrawerAuction({ openOrClose, setOpenOrClose, auction, eventId }: DrawerAuctionProps) {
  const cEvent = UseEventContext();
  const screens = useBreakpoint();
  const { products, getProducts, loading: ProductsLoading } = useProducts(eventId);
  const { Bids, loading } = useBids(eventId, auction?.currentProduct?._id, auction?.playing);
  const [canOffer, setcanOffer] = useState(true);

  const validOffer = (value: string): boolean => {
    const offer = Number(value);
    return auction?.currentProduct?.price !== undefined && offer > auction?.currentProduct?.price;
  };
  const reloadProducts = (tab: string) => {
    if (tab === TabsDrawerAuction.History) {
      getProducts();
    }
  };

  const onBid = async (data: { offerValue: string }) => {
    setcanOffer(false);
    const timeAwait = setTimeout(() => {
      setcanOffer(true);
      clearTimeout(timeAwait);
    }, 3000);

    const isValid = validOffer(data.offerValue);

    if (isValid && auction?.currentProduct?._id && data.offerValue) {
      saveOffer(
        eventId,
        auction?.currentProduct?._id,
        {
          date: new Date().toLocaleString(),
          name: 'carlos',
          offered: Number(data.offerValue),
        },
        auction
      );
    }
    if (!isValid) {
      notification.warning({
        message: 'El valor debe ser mayor al precio actual del articulo',
      });
    }
  };

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
                <Tabs
                  defaultActiveKey={TabsDrawerAuction.Bids}
                  draggable
                  style={{ width: '100%' }}
                  onChange={reloadProducts}
                  tabBarStyle={{ margin: '0px' }}>
                  <Tabs.TabPane key={TabsDrawerAuction.Bids} tab='Pujas'>
                    <Row justify='center'>
                      <Col span={24}>
                        <List
                          loading={loading}
                          dataSource={Bids}
                          renderItem={(item) => (
                            <List.Item>
                              <Skeleton avatar title={false} loading={loading}>
                                <List.Item.Meta
                                  avatar={<Avatar>{item.name[0] || 'A'}</Avatar>}
                                  title={<a>{item.name}</a>}
                                  description={item.date}
                                />
                                <Statistic value={item.offered} prefix='$' suffix={auction.currency} />
                              </Skeleton>
                            </List.Item>
                          )}
                        />
                      </Col>
                    </Row>
                  </Tabs.TabPane>
                  <Tabs.TabPane key={TabsDrawerAuction.History} tab='Historial de articulos' closable>
                    <Row>
                      <Col span={24}>
                        <List
                          loading={ProductsLoading}
                          dataSource={products.filter((product) => product.state === 'auctioned')}
                          renderItem={(item) => (
                            <List.Item>
                              <Skeleton avatar title={false} loading={ProductsLoading}>
                                <List.Item.Meta
                                  avatar={<Avatar src={item.images[0].url}></Avatar>}
                                  title={<a>{item.name}</a>}
                                />
                                <Statistic
                                  valueStyle={{ color: '#3f8600' }}
                                  value={item.end_price || item.price}
                                  prefix='OLD $'
                                  suffix={auction.currency}
                                />
                              </Skeleton>
                            </List.Item>
                          )}
                        />
                      </Col>
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
              <CardProduct auction={auction} />
            </Col>
          </Row>
          <Row gutter={[16, 16]} justify='center'>
            <Col xs={24} sm={24} md={24} lg={14} xl={14} xxl={14} style={{ margin: 10 }}>
              <Form onFinish={onBid} layout='vertical'>
                <Form.Item
                  name={'offerValue'}
                  rules={[
                    { required: true, message: `Se requiere un valor minimo de  ${auction.currentProduct?.price}` },
                  ]}>
                  <Input size='large' type='number' prefix='$' suffix={auction.currency} />
                </Form.Item>
                <Button
                  style={{ width: '100%' }}
                  htmlType='submit'
                  type='primary'
                  size='large'
                  disabled={!auction.playing || !canOffer}>
                  EmPujar
                </Button>
              </Form>
            </Col>
          </Row>
        </Col>
      </Row>
    </Drawer>
  );
}
