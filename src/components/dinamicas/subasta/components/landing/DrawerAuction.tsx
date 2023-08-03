import React, { useState } from 'react';
import {
  Card,
  Col,
  Drawer,
  Row,
  Tabs,
  Grid,
  Space,
  Typography,
  Skeleton,
  List,
  Avatar,
  Input,
  Statistic,
  notification,
  Empty,
  Modal,
  Form,
  Button,
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
import DrawerRules from '@/components/games/whereIs/auxiliarDrawers/DrawerRules';
import DrawerChat from '@/components/games/whereIs/auxiliarDrawers/DrawerChat';
import ButtonsContainer from './ButtonsContainer';
import { UseUserEvent } from '@/context/eventUserContext';

const { useBreakpoint } = Grid;

export default function DrawerAuction({ openOrClose, setOpenOrClose, auction, eventId }: DrawerAuctionProps) {
  const cEvent = UseEventContext();
  const screens = useBreakpoint();
  let cEventUser = UseUserEvent();

  const { products, getProducts, loading: ProductsLoading } = useProducts(eventId);
  const { Bids, loading } = useBids(eventId, auction?.currentProduct?._id, auction?.playing);
  const [canOffer, setcanOffer] = useState(true);
  const [showDrawerChat, setshowDrawerChat] = useState<boolean>(false);
  const [showDrawerRules, setshowDrawerRules] = useState<boolean>(false);
  const [modalOffer, setmodalOffer] = useState<boolean>(false);
  const userName = cEventUser.value?.properties?.names || cEventUser.value?.user?.names
  
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
          name: userName || 'Anónimo',
          offered: Number(data.offerValue),
        },
        auction
      );
      setmodalOffer(false)
    }
    if (!isValid) {
      notification.warning({
        message: 'El valor debe ser mayor al precio actual del artículo',
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
        <Row justify='end' align='middle'>
          <Typography.Title style={{ display: 'fex', margin: '1px' }} level={5}>
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
      <Row justify={'space-between'} gutter={[16, 8]} wrap>
        <Col xs={24} sm={24} md={24} lg={10} xl={12} xxl={12} style={{ height: '100%' }}>
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
                        {Bids.length > 0 ? (
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
                        ) : (
                          <Empty
                            style={{ height: '250px', display: 'grid', justifyContent: 'center', alignItems: 'center' }}
                            description={'Sin puja'}
                          />
                        )}
                      </Col>
                    </Row>
                  </Tabs.TabPane>
                  <Tabs.TabPane key={TabsDrawerAuction.History} tab='Historial de artículos' closable>
                    <Row>
                      <Col span={24}>
                        {products.filter((product) => product.state === 'auctioned').length > 0 ? (
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
                                    value={item.end_price ?? item.price}
                                    prefix='OLD $'
                                    suffix={auction.currency}
                                  />
                                </Skeleton>
                              </List.Item>
                            )}
                          />
                        ) : (
                          <Empty
                            style={{ height: '250px', display: 'grid', justifyContent: 'center', alignItems: 'center' }}
                            description={'Sin artículos'}
                          />
                        )}
                      </Col>
                    </Row>
                  </Tabs.TabPane>
                </Tabs>
              </Card>
            </Col>
          </Row>
        </Col>
        <Col xs={24} sm={24} md={24} lg={8} xl={6} xxl={6}>
          <Row gutter={[0, 8]} /* justify='center' */>
            <Col span={24}>
              <CardProduct auction={auction} />
            </Col>
            <Modal
            visible={modalOffer}
            footer={null}
            closable
            destroyOnClose
            onCancel={()=>setmodalOffer(false)}
>
              <Form onFinish={onBid} layout='vertical' style={{ margin: 15}}>
                <Form.Item
                  name={'offerValue'}
                  label='Valor de la puja'
                  initialValue={auction.currentProduct?.price || 0}
                  rules={[
                    { required: true, message: `Se requiere un valor mínimo de  ${auction.currentProduct?.price}` },
                  ]}
                  >
                  <Input defaultValue={auction.currentProduct?.price} size='large' type='number' prefix='$' suffix={auction.currency} />
                </Form.Item>
                <Button
                  style={{ width: '100%' }}
                  htmlType='submit'
                  type='primary'
                  size='large'
                  disabled={!auction.playing || !canOffer}>
                  Pujar
                </Button>
              </Form>
            </Modal>
          </Row>
        </Col>
        <Col xs={24} sm={24} md={24} lg={6} xl={4} xxl={4}>
          <ButtonsContainer
            validate={!auction.playing || !canOffer}
            onClick={()=>setmodalOffer(true)}
            setshowDrawerChat={setshowDrawerChat}
            setshowDrawerRules={setshowDrawerRules}
            closedrawer={setOpenOrClose}
          />

          <DrawerRules showDrawerRules={showDrawerRules} setshowDrawerRules={setshowDrawerRules} />
          <DrawerChat showDrawerChat={showDrawerChat} setshowDrawerChat={setshowDrawerChat} />
        </Col>
      </Row>
    </Drawer>
  );
}
