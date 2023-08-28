import React, { useRef, useState } from 'react';
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
  Affix,
  InputNumber,
} from 'antd';
import HCOActividad from '@/components/events/AgendaActividadDetalle/HOC_Actividad';
import { CloseOutlined, MinusOutlined, PlusOutlined } from '@ant-design/icons';
import { DrawerAuctionProps } from '../../interfaces/auction.interface';
import CardProduct from './CardProduct';
import { useBids } from '../../hooks/useBids';
import { saveOffer } from '../../services';
import useProducts from '../../hooks/useProducts';
import { TabsDrawerAuction } from '../../utils/utils';
import DrawerRules from './DrawerRules';
import DrawerChat from '@/components/games/bingo/components/auxiliarDrawers/DrawerChat';
import ButtonsContainer from './ButtonsContainer';
import { getCorrectColor } from '@/helpers/utils';

const { useBreakpoint } = Grid;

export default function DrawerAuction({
  openOrClose,
  setOpenOrClose,
  auction,
  eventId,
  cEventUser,
  cEvent,
}: DrawerAuctionProps) {
  const screens = useBreakpoint();

  const { products, getProducts, loading: ProductsLoading } = useProducts(eventId);

  const { Bids, loading } = useBids(eventId, auction?.currentProduct?._id, auction?.playing);
  const [canOffer, setcanOffer] = useState(true);
  const [showDrawerChat, setshowDrawerChat] = useState<boolean>(false);
  const [showDrawerRules, setshowDrawerRules] = useState<boolean>(false);
  const [modalOffer, setmodalOffer] = useState<boolean>(false);
  const [time, setTime] = useState(0)
  const userName = cEventUser.value?.properties?.names || cEventUser.value?.user?.names;
  const inputRef = useRef();

  const validOffer = (value: string): boolean => {
    const offer = Number(value);
    return auction?.currentProduct?.price !== undefined && offer > (Bids[0]?.offered ?? auction?.currentProduct?.price);
  };
  const reloadProducts = (tab: string) => {
    if (tab === TabsDrawerAuction.History) {
      getProducts();
    }
  };

  const onBid = async (data: { offerValue: string }) => {
    const isValid = validOffer(data.offerValue);

    if (auction.playing && isValid && auction?.currentProduct?._id && data.offerValue) {
      setcanOffer(false);
      setTime(Date.now() + auction.timerBids * 1000)
      const timeAwait = setTimeout(() => {
        setcanOffer(true);
        clearTimeout(timeAwait);
      }, auction.timerBids * 1000);

      saveOffer(
        eventId,
        {
          productName: auction?.currentProduct?.name,
          productId: auction?.currentProduct?._id,
          date: new Date().toLocaleString(),
          name: userName || 'Anónimo',
          userId: cEventUser.value?.user?._id,
          offered: Number(data.offerValue),
        },
        auction
      );
      setmodalOffer(false);
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
        backgroundImage: `url(${auction.styles?.general?.backgroundImage})`,
        backgroundColor: auction.styles?.general?.backgroundColor,
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
            {auction.name ? `Subasta: ${auction.name}` : 'Subasta'}
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
      destroyOnClose={true}
      footer={
        screens.xs && <ButtonsContainer
          styles={{
            backgroundColor: auction.styles?.cards?.backgroundColor || '#FFFFFF',
            color: auction.styles?.cards?.color || '#000000',
          }}
          validate={!canOffer}
          onClick={() => setmodalOffer(true)}
          setshowDrawerChat={setshowDrawerChat}
          setshowDrawerRules={setshowDrawerRules}
          closedrawer={setOpenOrClose}
          timer={time}
        />
      }
      footerStyle={{backgroundColor: auction?.styles?.cards?.backgroundColor}}
    >
      <Row gutter={[32, 32]} wrap justify='space-between'>
        <Col xs={24} sm={24} md={12} lg={12} xl={12} xxl={12} /* style={{ height: '100%' }} */>
          <Row gutter={[16, 16]}>
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
                <Affix offsetTop={screens.xs ? 35 : 0}>
                  <HCOActividad isBingo={true} />
                </Affix>
              </Card>
            </Col>
            {!screens.xs && (
              <Col span={24}>
                <Card
                  style={{
                    borderRadius: '20px',
                    backgroundColor: auction.styles?.cards?.backgroundColor || '',
                    maxHeight: '450px',
                    overflowY: 'auto',
                  }}
                  bordered={false}
                  className='desplazar'
                  bodyStyle={{ padding: '0px 20px' }}>
                  <Tabs
                    defaultActiveKey={TabsDrawerAuction.Bids}
                    draggable
                    style={{ color: getCorrectColor(auction?.styles?.cards?.backgroundColor) }}
                    onChange={reloadProducts}
                    tabBarStyle={{ margin: '0px' }}>
                    <Tabs.TabPane key={TabsDrawerAuction.Bids} tab='Pujas'>
                      <Row justify='center'>
                        <Col span={24}>
                          {Bids.length > 0 ? (
                            <List
                              style={{ height: '100%' }}
                              loading={loading}
                              dataSource={Bids}
                              renderItem={(item) => (
                                <List.Item>
                                  <Skeleton avatar title={false} loading={loading}>
                                    <List.Item.Meta
                                      avatar={<Avatar>{item.name[0] || 'A'}</Avatar>}
                                      title={
                                        <Typography.Text
                                          style={{ color: getCorrectColor(auction?.styles?.cards?.backgroundColor) }}>
                                          {item.name}
                                        </Typography.Text>
                                      }
                                      description={
                                        <Typography.Text
                                          style={{ color: getCorrectColor(auction?.styles?.cards?.backgroundColor) }}>
                                          {item.date}
                                        </Typography.Text>
                                      }
                                    />
                                    <Statistic
                                      valueStyle={{ color: getCorrectColor(auction?.styles?.cards?.backgroundColor) }}
                                      value={item.offered}
                                      prefix='$'
                                      suffix={auction.currency}
                                    />
                                  </Skeleton>
                                </List.Item>
                              )}
                            />
                          ) : (
                            <Empty
                              style={{
                                height: '250px',
                                display: 'grid',
                                justifyContent: 'center',
                                alignItems: 'center',
                              }}
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
                                      title={
                                        <Typography.Text
                                          style={{ color: getCorrectColor(auction?.styles?.cards?.backgroundColor) }}>
                                          {item.name}
                                        </Typography.Text>
                                      }
                                    />
                                    <Statistic
                                      valueStyle={{ color: getCorrectColor(auction.styles?.cards?.backgroundColor) }}
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
                              style={{
                                height: '250px',
                                display: 'grid',
                                justifyContent: 'center',
                                alignItems: 'center',
                              }}
                              description={'Sin artículos'}
                            />
                          )}
                        </Col>
                      </Row>
                    </Tabs.TabPane>
                  </Tabs>
                </Card>
              </Col>
            )}
          </Row>
        </Col>
        <Col xs={24} sm={24} md={8} lg={8} xl={8} xxl={8}>
          <Row gutter={[16, 16]} justify='center'>
            <Col span={20}>
              <CardProduct auction={auction} currentPrice={Bids[0]?.offered}/>
            </Col>
            <Modal visible={modalOffer} footer={null} closable destroyOnClose onCancel={() => setmodalOffer(false)}>
              <Form onFinish={onBid} layout='vertical' style={{ margin: 10 }}>
                <Form.Item
                  name={'offerValue'}
                  label='Valor de la puja'
                  initialValue={(Bids[0]?.offered ??  auction.currentProduct?.start_price) + (auction.amount ?? 0)}
                  rules={[
                    { required: true, message: `Se requiere un valor mayor que  ${Bids[0]?.offered ?? auction.currentProduct?.start_price}` },
                  ]}>
                  {
                    //@ts-ignore
                  }
                  <InputNumber
                    style={{ width: '100%' }} 
                    controls={{ upIcon: <PlusOutlined />, downIcon: <MinusOutlined /> }}
                    min={(auction.currentProduct?.price ?? 0) + (auction.amount ?? 0)}
                    step={auction.amount ?? 1}
                    size='large'
                    type='number'
                    prefix='$'
                  />
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
        <Col xs={24} sm={24} md={4} lg={4} xl={4} xxl={4}>
          {!screens.xs &&
            <ButtonsContainer
              styles={{
                backgroundColor: auction.styles?.cards?.backgroundColor || '#FFFFFF',
                color: auction.styles?.cards?.color || '#000000',
              }}
              validate={true}/* !canOffer */
              onClick={() => setmodalOffer(true)}
              setshowDrawerChat={setshowDrawerChat}
              setshowDrawerRules={setshowDrawerRules}
              closedrawer={setOpenOrClose}
              timer={time}
            />
          }

          <DrawerRules
            cEvent={cEvent}
            showDrawerRules={showDrawerRules}
            setshowDrawerRules={setshowDrawerRules}
            auctionRules={auction.rules ?? ''}
          />
          <DrawerChat showDrawerChat={showDrawerChat} setshowDrawerChat={setshowDrawerChat} />
        </Col>
        {screens.xs && (
          <Col span={24}>
            <Card
              style={{
                borderRadius: '20px',
                backgroundColor: auction.styles?.cards?.backgroundColor || '',
                maxHeight: '450px',
                overflowY: 'auto',
              }}
              bordered={false}
              className='desplazar'
              bodyStyle={{ padding: '0px 20px' }}>
              <Tabs
                defaultActiveKey={TabsDrawerAuction.Bids}
                draggable
                style={{ color: getCorrectColor(auction?.styles?.cards?.backgroundColor) }}
                onChange={reloadProducts}
                tabBarStyle={{ margin: '0px' }}>
                <Tabs.TabPane key={TabsDrawerAuction.Bids} tab='Pujas'>
                  <Row justify='center'>
                    <Col span={24}>
                      {Bids.length > 0 ? (
                        <List
                          style={{ height: '100%' }}
                          loading={loading}
                          dataSource={Bids}
                          renderItem={(item) => (
                            <List.Item>
                              <Skeleton avatar title={false} loading={loading}>
                                <List.Item.Meta
                                  avatar={<Avatar>{item.name[0] || 'A'}</Avatar>}
                                  title={
                                    <Typography.Text
                                      style={{ color: getCorrectColor(auction?.styles?.cards?.backgroundColor) }}>
                                      {item.name}
                                    </Typography.Text>
                                  }
                                  description={
                                    <Typography.Text
                                      style={{ color: getCorrectColor(auction?.styles?.cards?.backgroundColor) }}>
                                      {item.date}
                                    </Typography.Text>
                                  }
                                />
                                <Statistic
                                  valueStyle={{ color: getCorrectColor(auction?.styles?.cards?.backgroundColor) }}
                                  value={item.offered}
                                  prefix='$'
                                  suffix={auction.currency}
                                />
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
                                  title={
                                    <Typography.Text
                                      style={{ color: getCorrectColor(auction?.styles?.cards?.backgroundColor) }}>
                                      {item.name}
                                    </Typography.Text>
                                  }
                                />
                                <Statistic
                                  valueStyle={{ color: getCorrectColor(auction.styles?.cards?.backgroundColor) }}
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
        )}
      </Row>
    </Drawer>
  );
}
