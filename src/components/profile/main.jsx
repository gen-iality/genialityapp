import React, { useState, useEffect } from 'react';
import { Avatar, Card, Col, Layout, Menu, Row, Space, Statistic, Tabs, Typography, Grid, Divider } from 'antd';
import { AppstoreFilled, SettingOutlined } from '@ant-design/icons';
import OrganizationCard from './organizationCard';
import NewCard from './newCard';
import ExploreEvents from './exploreEvents';
import withContext from '../../Context/withContext';
import { EventsApi, TicketsApi, OrganizationApi } from '../../helpers/request';
import EventCard from '../shared/eventCard';
import { Link } from 'react-router-dom';
import * as Cookie from 'js-cookie';

const { Content, Sider } = Layout;
const { TabPane } = Tabs;
const { useBreakpoint } = Grid;

const MainProfile = (props) => {
  const [activeTab, setActiveTab] = useState();
  const [events, setevents] = useState([]);
  const [tickets, settickets] = useState([]);
  const [organizations, setorganizations] = useState([]);
  const [eventsLimited, seteventsLimited] = useState([]);
  const [ticketsLimited, setticketsLimited] = useState([]);
  const [organizationsLimited, setorganizationsLimited] = useState([]);
  const screens = useBreakpoint();
  const selectedTab = props.match.params.tab;

  const fetchItem = async () => {
    /* Eventos creados por el usuario    */
    const events = await EventsApi.mine();
    setevents(events);
    seteventsLimited(events.slice(0, 3));
    /* ----------------------------------*/
    /* Eventos en los que esta registrado el usuario */
    const token = Cookie.get('evius_token');
    const ticketsall = await TicketsApi.getAll(token);
    const usersInscription = [];
    ticketsall.forEach(async (element) => {
      const eventByTicket = await EventsApi.getOne(element.event_id);
      if (eventByTicket) {
        usersInscription.push(eventByTicket);
      }
      settickets(usersInscription);
      setticketsLimited(usersInscription.slice(0, 4));
    });

    /* ----------------------------------*/
    /* Organizaciones del usuario */
    const organizations = await OrganizationApi.mine();
    setorganizations(organizations);
    setorganizationsLimited(organizations.slice(0, 5));
    /* ----------------------------------*/
  };

  useEffect(() => {
    fetchItem();
    switch (selectedTab) {
      case 'organization':
        setActiveTab('2');
        break;
      case 'events':
        setActiveTab('3');
        break;
      case 'tickets':
        setActiveTab('4');
        break;
      default:
        setActiveTab('1');
    }
  }, []);
  console.log('pantallas', ticketsLimited);

  return (
    <Layout style={{ height: '90.8vh' }}>
      <Sider
        defaultCollapsed={true}
        width={!screens.xs ? 300 : '92vw'}
        style={{ backgroundColor: '#ffffff', paddingTop: '10px', paddingBottom: '10px' }}
        breakpoint='lg'
        collapsedWidth='0'
        zeroWidthTriggerStyle={{ top: '-40px', width: '50px' }}>
        <Row justify='center' gutter={[10, 20]}>
          <Space
            size={5}
            direction='vertical'
            style={{ textAlign: 'center', paddingLeft: '15px', paddingRight: '15px' }}>
            <Avatar size={150} src={'https://i.pravatar.cc/300'} />
            <Typography.Text style={{ fontSize: '20px', width: '250px' }}>Nombre del usuario</Typography.Text>
            <Typography.Text type='secondary' style={{ fontSize: '16px', width: '220px', wordBreak: 'break-all' }}>
              usuario@email.com
            </Typography.Text>
          </Space>
          <Col style={{ paddingLeft: '30px', paddingRight: '30px' }} span={24}>
            <Card style={{ textAlign: 'center', borderRadius: '15px' }}>
              <Statistic
                title={<span style={{ fontSize: '18px' }}>Eventos creados</span>}
                value={events.length && events.length > 0 ? events.length : 0}
                loading={events.length ? false : true}
                precision={0}
                valueStyle={{ color: '#3f8600', fontSize: '50px' }}
              />
            </Card>
          </Col>
          <Col style={{ paddingLeft: '30px', paddingRight: '30px' }} span={24}>
            <Card style={{ textAlign: 'center', borderRadius: '15px' }}>
              <Statistic
                title={<span style={{ fontSize: '18px' }}>Eventos en los que estoy registrado</span>}
                value={tickets.length && tickets.length > 0 ? tickets.length : 0}
                loading={tickets.length ? false : true}
                precision={0}
                valueStyle={{ color: '#3f8600', fontSize: '50px' }}
              />
            </Card>
          </Col>
        </Row>
      </Sider>
      <Layout>
        <Content style={{ margin: '0px', padding: '10px', overflowY: 'auto' }}>
          <Tabs
            defaultActiveKey={activeTab}
            activeKey={activeTab}
            onTabClick={(key) => {
              setActiveTab(key);
            }}>
            {!screens.xs && (
              <TabPane
                tab={
                  <Space size={0}>
                    <AppstoreFilled /> Todos
                  </Space>
                }
                key='1'>
                <Row gutter={[16, 16]}>
                  <Col span={24}>
                    <Divider orientation='left'>Eventos creado</Divider>
                    <Row gutter={[16, 16]}>
                      <Col key={'index'} xs={24} sm={12} md={12} lg={8} xl={6}>
                        <NewCard entityType='event' />
                      </Col>
                      {/* aqui empieza el mapeo de eventCard.jsx maximo 4 */}
                      {eventsLimited.length > 0 &&
                        eventsLimited.map((event) => {
                          return (
                            <Col key={event._id} xs={24} sm={12} md={12} lg={8} xl={6}>
                              <EventCard
                                isAdmin
                                bordered={false}
                                key={event._id}
                                event={event}
                                action={{ name: 'Ver', url: `landing/${event._id}` }}
                                right={[
                                  <div key={'event-' + event._id}>
                                    <Link to={`/eventadmin/${event._id}`}>
                                      <Space>
                                        <SettingOutlined />
                                        <span>Administrar</span>
                                      </Space>
                                    </Link>
                                  </div>,
                                ]}
                              />
                            </Col>
                          );
                        })}
                      {/* aqui termina el mapeo de eventCard.jsx maximo 4  */}
                    </Row>
                  </Col>
                  <Col span={24}>
                    <Divider orientation='left'>Eventos en los que estoy registrado</Divider>
                    <Row gutter={[16, 16]}>
                      {ticketsLimited.length > 0 ? (
                        ticketsLimited.map((event) => {
                          return (
                            <Col key={event._id} xs={24} sm={12} md={12} lg={8} xl={6}>
                              <EventCard
                                bordered={false}
                                key={event._id}
                                event={event}
                                action={{ name: 'Ver', url: `landing/${event._id}` }}
                              />
                            </Col>
                          );
                        })
                      ) : (
                        <Col span={24}>
                          <ExploreEvents />
                        </Col>
                      )}
                    </Row>
                  </Col>
                  <Col span={24}>
                    <Divider orientation='left'>Organizaciones</Divider>
                    <Row gutter={[16, 16]}>
                      <Col key={'index1'} xs={12} sm={8} md={8} lg={6} xl={4} xxl={4}>
                        <NewCard entityType='organization' />
                      </Col>
                      {/* aqui empieza el mapeo maximo 6 */}
                      {organizationsLimited.length > 0 &&
                        organizationsLimited.map((organization) => {
                          return (
                            <Col key={'index'} xs={12} sm={8} md={8} lg={6} xl={4} xxl={4}>
                              <OrganizationCard data={organization} />
                            </Col>
                          );
                        })}
                      {/* aqui termina el mapeo maximo 6 */}
                    </Row>
                  </Col>
                </Row>
              </TabPane>
            )}
            <TabPane tab='Organizaciones' key='2'>
              <Row gutter={[16, 16]}>
                <Col xs={12} sm={8} md={8} lg={6} xl={4} xxl={4}>
                  <NewCard entityType='organization' />
                </Col>
                {organizations.length > 0 &&
                  organizations.map((organization) => {
                    return (
                      <Col key={'index'} xs={12} sm={8} md={8} lg={6} xl={4} xxl={4}>
                        <OrganizationCard data={organization} />
                      </Col>
                    );
                  })}
              </Row>
            </TabPane>
            <TabPane tab='Eventos creados' key='3'>
              <Row gutter={[16, 16]}>
                <Col xs={24} sm={12} md={12} lg={8} xl={6}>
                  <NewCard entityType='event' />
                </Col>
                {events.map((event) => {
                  return (
                    <Col key={event._id} xs={24} sm={12} md={12} lg={8} xl={6}>
                      <EventCard
                        isAdmin
                        bordered={false}
                        key={event._id}
                        event={event}
                        action={{ name: 'Ver', url: `landing/${event._id}` }}
                        right={[
                          <div key={'event-' + event._id}>
                            <Link to={`/eventadmin/${event._id}`}>
                              <Space>
                                <SettingOutlined />
                                <span>Administrar</span>
                              </Space>
                            </Link>
                          </div>,
                        ]}
                      />
                    </Col>
                  );
                })}
              </Row>
            </TabPane>
            <TabPane tab='Registros a eventos' key='4'>
              <Row gutter={[16, 16]}>
                {tickets.map((event) => {
                  return (
                    <Col key={event._id} xs={24} sm={12} md={12} lg={8} xl={6}>
                      <EventCard
                        bordered={false}
                        key={event._id}
                        event={event}
                        action={{ name: 'Ver', url: `landing/${event._id}` }}
                      />
                    </Col>
                  );
                })}
              </Row>
            </TabPane>
          </Tabs>
        </Content>
      </Layout>
    </Layout>
  );
};

export default withContext(MainProfile);
