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
  Tooltip,
} from 'antd';
import HCOActividad from '@/components/events/AgendaActividadDetalle/HOC_Actividad';
import { CloseOutlined, InfoCircleOutlined, MinusOutlined, PlusOutlined } from '@ant-design/icons';
import { DrawerAuctionProps } from '../../interfaces/auction.interface';
import CardProduct from './CardProduct';
import { useBids } from '../../hooks/useBids';
import { saveOffer } from '../../services';
import useProducts from '../../hooks/useProducts';
import { DATE_FORMAT, TabsDrawerAuction } from '../../utils/utils';
import DrawerRules from './DrawerRules';
import DrawerChat from '@/components/games/bingo/components/auxiliarDrawers/DrawerChat';
import ButtonsContainer from './ButtonsContainer';
import { getCorrectColor } from '@/helpers/utils';
import { FaGavel } from 'react-icons/fa'
import moment from 'moment';
import useBreakpoint from 'use-breakpoint'
import '../../styles/landing.styles.css'

/* const { useBreakpoint } = Grid; */
const BREAKPOINTS = { mobile: 0, tablet: 768, desktop: 1280, largeScreen: 1920 }

export default function DrawerAuction({
  openOrClose,
  setOpenOrClose,
  auction,
  eventId,
  cEventUser,
  cEvent,
}: DrawerAuctionProps) {
  /* const screens = useBreakpoint(); */
  const { breakpoint } = useBreakpoint(BREAKPOINTS, 'desktop')

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
          date: moment(new Date()).format(DATE_FORMAT),
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
  const haveMount = auction.amount !== undefined && auction.amount !== 0 && auction.amount !== null
  
  return (
    <Drawer
      headerStyle={{
        backgroundColor: auction?.styles?.cards?.backgroundColor,
        border: 'none',
        height: breakpoint === 'mobile' ? '60px' : '',
      }}
      title={
        <Space align='center'>
          <FaGavel style={{ color: getCorrectColor(auction?.styles?.cards?.backgroundColor)}} />
          <Typography.Text 
            strong 
            style={{ color: getCorrectColor(auction?.styles?.cards?.backgroundColor), width: breakpoint === 'mobile' ? '290px' : '',}} ellipsis
          >
            {auction?.name}
          </Typography.Text>
          {breakpoint === 'mobile' && auction?.name.length > 29 && 
            <Tooltip 
              title={
                <Space>
                  <FaGavel style={{color: getCorrectColor(auction?.styles?.cards?.backgroundColor)}} />
                  <Typography.Text strong style={{color: getCorrectColor(auction?.styles?.cards?.backgroundColor)}}>{auction?.name}</Typography.Text>
                </Space>
              } placement='bottomRight' color={auction?.styles?.cards?.backgroundColor}>
              <InfoCircleOutlined style={{cursor: 'pointer', color: getCorrectColor(auction?.styles?.cards?.backgroundColor)}}/>
            </Tooltip>
          }
        </Space>
      }
      bodyStyle={{
        backgroundImage: `url(${auction.styles?.general?.backgroundImage})`,
        backgroundColor: auction.styles?.general?.backgroundColor,
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
        backgroundSize: 'cover',
        paddingTop: '5px',
        paddingBottom: '5px',
        paddingLeft: breakpoint === 'mobile' ? '5px' : '24px',
        paddingRight: breakpoint === 'mobile' ? '5px' : '24px',
        overflowX: 'hidden',
      }}
      visible={openOrClose}
      closable={false}
      onClose={setOpenOrClose}
      extra={ breakpoint !== 'mobile' &&
        <Tooltip placement='bottomLeft' title='Cerrar'>
          <Button icon={<CloseOutlined style={{ fontSize: 20, color: getCorrectColor(auction?.styles?.cards?.backgroundColor) }} />} onClick={setOpenOrClose} type='text' />
        </Tooltip>
      }
      width={'100vw'}
      destroyOnClose={true}
      footer={
        breakpoint === 'desktop' || breakpoint === 'largeScreen' || (breakpoint === 'tablet' && window.matchMedia('(orientation: landscape)').matches) ? null : <ButtonsContainer
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
      footerStyle={{backgroundColor: auction?.styles?.cards?.backgroundColor,}}
    >
      <Row justify='center' align='middle' style={breakpoint === 'largeScreen' ? {height: '100%'} : {}}>
        <Col span={breakpoint === 'largeScreen' ? 19 : 24}>
          <Row 
            gutter={breakpoint === 'mobile' ? [0, 16] : breakpoint === 'tablet' ? [8, 8] : [32, 32]} 
            wrap 
            justify={'space-between'}
          >
            <Col xs={24} sm={24} md={breakpoint === 'tablet' && !window.matchMedia('(orientation: landscape)').matches ? 24: 12} lg={12} xl={12} xxl={12}>
              <Row gutter={[16, 16]}>
                <Col span={24}>
                  <Affix offsetTop={breakpoint === 'mobile' ? 65 : 0}>
                    <Card
                      /* style={{ backgroundColor: auction?.styles?.cards?.backgroundColor }} */
                      bordered={false}
                      bodyStyle={{
                        padding: '0px',
                        overflow: 'hidden',
                        borderRadius: '20px',
                      }}
                      style={{borderRadius: '20px',}}>
                      {/* @ts-ignore */}
                      <HCOActividad isBingo={true} />
                    </Card>
                  </Affix>
                </Col>
                {breakpoint !== 'mobile' && window.matchMedia('(orientation: landscape)').matches && (
                  <Col span={24}>
                    <Card
                      style={{
                        borderRadius: '20px',
                        backgroundColor: auction.styles?.cards?.backgroundColor || '',
                        maxHeight: breakpoint === 'largeScreen' ? '350px' : '230px',
                      }}
                      bordered={false}
                      bodyStyle={{ padding: '0px 20px' }}>
                      <Tabs
                        defaultActiveKey={TabsDrawerAuction.Bids}
                        draggable
                        style={{ color: getCorrectColor(auction?.styles?.cards?.backgroundColor) }}
                        onChange={reloadProducts}
                        tabBarStyle={{ margin: '0px' }}>
                        <Tabs.TabPane key={TabsDrawerAuction.Bids} tab='Pujas'>
                          {Bids.length > 0 ? (
                            <div style={{ 
                                height: breakpoint === 'largeScreen' ? '280px' : '180px' ,
                                overflowY: 'auto'
                              }}
                              className='desplazar'
                            >
                              <List
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
                            </div>
                          ) : (
                            <Empty
                              style={{
                                height: breakpoint === 'largeScreen' ? '280px' : '180px',
                                display: 'grid',
                                justifyContent: 'center',
                                alignItems: 'center',
                              }}
                              description={'Sin pujas'}
                            />
                          )}
                        </Tabs.TabPane>
                        <Tabs.TabPane key={TabsDrawerAuction.History} tab='Historial de artículos' closable>
                          <div style={{ 
                              height: breakpoint === 'largeScreen' ? '280px' : '180px' ,
                              overflowY: 'auto'
                            }}
                            className='desplazar'
                          >
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
                                  height: breakpoint === 'largeScreen' ? '280px' : '180px',
                                  display: 'grid',
                                  justifyContent: 'center',
                                  alignItems: 'center',
                                }}
                                description={'Sin artículos'}
                              />
                            )}
                          </div>
                        </Tabs.TabPane>
                      </Tabs>
                    </Card>
                  </Col>
                )}
              </Row>
            </Col>
            <Col xs={24} sm={24} md={breakpoint === 'tablet' && !window.matchMedia('(orientation: landscape)').matches ? 12 : 8} lg={8} xl={8} xxl={8}>
              <Row justify='center'>
                <Col span={24}>
                  <CardProduct auction={auction} currentPrice={Bids[0]?.offered}/>
                </Col>
                <Modal visible={modalOffer} footer={null} closable destroyOnClose onCancel={() => setmodalOffer(false)}>
                  <Form onFinish={onBid} layout='vertical' style={{ margin: 10 }}>
                    <Form.Item
                      name={'offerValue'}
                      label='Desea confirmar el valor de la puja'
                      className={haveMount  ?  'input_center' : ''}
                      initialValue={(Bids[0]?.offered ??  auction.currentProduct?.start_price) + (auction.amount ?? 0)}
                      rules={[
                        { required: true, message: `Se requiere un valor mayor que  ${Bids[0]?.offered ?? auction.currentProduct?.start_price}` },
                      ]}>
                      {
                        //@ts-ignore
                      }
                      <InputNumber
                        readOnly={haveMount}
                        className={haveMount  ?  'input_puja' : ''}
                        style={{ width: '100%' }}
                        controls={{ upIcon: <PlusOutlined />, downIcon: <MinusOutlined /> }}
                        min={(Bids[0]?.offered ??  auction.currentProduct?.start_price) + (auction.amount ?? 0)}
                        size='large'
                        prefix='$'
                        formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
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
            {breakpoint !== 'mobile' && window.matchMedia('(orientation: landscape)').matches &&
              <Col xs={24} sm={24} md={4} lg={4} xl={4} xxl={4}>
                <ButtonsContainer
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

              </Col>
            }
            {(breakpoint === 'mobile' || (breakpoint === 'tablet' && !window.matchMedia('(orientation: landscape)').matches)) && (
              <Col span={breakpoint === 'mobile' ? 24 : 12}>
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
                      <div style={{ 
                          height: '180px' ,
                          overflowY: 'auto'
                        }}
                        className='desplazar'
                      >
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
                            style={{ height: '180px', display: 'grid', justifyContent: 'center', alignItems: 'center' }}
                            description={'Sin pujas'}
                          />
                        )}
                      </div>
                    </Tabs.TabPane>
                    <Tabs.TabPane key={TabsDrawerAuction.History} tab='Historial de artículos' closable>
                      <div style={{ 
                          height: '180px' ,
                          overflowY: 'auto'
                        }}
                        className='desplazar'
                      >
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
                            style={{ height: '180px', display: 'grid', justifyContent: 'center', alignItems: 'center' }}
                            description={'Sin artículos'}
                          />
                        )}
                      </div>
                    </Tabs.TabPane>
                  </Tabs>
                </Card>
              </Col>
            )}
          </Row>
        </Col>
      </Row>

      <DrawerRules
        cEvent={cEvent}
        showDrawerRules={showDrawerRules}
        setshowDrawerRules={setshowDrawerRules}
        auctionRules={auction.rules ?? ''}
        />
      <DrawerChat showDrawerChat={showDrawerChat} setshowDrawerChat={setshowDrawerChat} />
    </Drawer>
  );
}
