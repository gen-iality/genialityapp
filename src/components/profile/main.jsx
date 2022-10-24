import { useState, useEffect } from 'react';
import {
  Avatar,
  Card,
  Col,
  Layout,
  Row,
  Space,
  Statistic,
  Tabs,
  Typography,
  Grid,
  Divider,
  Skeleton,
  Menu,
} from 'antd';
import {
  AppstoreFilled,
  CarryOutOutlined,
  EditOutlined,
  LockOutlined,
  SettingOutlined,
  UserOutlined,
} from '@ant-design/icons';
import OrganizationCard from './organizationCard';
import NewCard from './newCard';
import ExploreEvents from './exploreEvents';
import withContext from '../../context/withContext';
import { EventsApi, TicketsApi, OrganizationApi } from '../../helpers/request';
import EventCard from '../shared/eventCard';
import { Link } from 'react-router-dom';
import moment from 'moment';
import Loading from './loading';
import ChangePassword from './components/changePassword';
import EditInformation from './components/EditInformation';
import MyPlan from './components/myPlan';
import { imageUtils } from '../../Utilities/ImageUtils';
import CashCheckIcon from '@2fd/ant-design-icons/lib/CashCheck';
import { useHelper } from '@/context/helperContext/hooks/useHelper';
import { featureBlockingListener } from '@/services/featureBlocking/featureBlocking';
import eventCard from '../shared/eventCard';

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
  const [organizationsIsLoading, setOrganizationsIsLoading] = useState(true);
  const [eventsIHaveCreatedIsLoading, setEventsIHaveCreatedIsLoading] = useState(true);
  const [eventsThatIHaveParticipatedIsLoading, setEventsThatIHaveParticipatedIsLoading] = useState(true);
  const [collapsed, setCollapsed] = useState(false);
  const [content, setContent] = useState('ACCOUNT_ACTIVITY');
  const screens = useBreakpoint();
  const selectedTab = props.match.params.tab;
  const { helperDispatch } = useHelper();

  const showSider = () => {
    if (!collapsed) {
      setCollapsed(true);
    } else {
      setCollapsed(false);
    }
  };

  const showContent = (key) => {
    setContent(key);
  };

  const eventsIHaveCreated = async () => {
    const events = await EventsApi.mine();

    if (events.length > 0) {
      events.map((event) => {
        featureBlockingListener(event._id, helperDispatch, 'map');
      });
    }
    const eventsDataSorted = events.sort((a, b) => moment(b.datetime_from) - moment(a.datetime_from));
    setevents(eventsDataSorted);
    seteventsLimited(events.slice(0, 3));
    setEventsIHaveCreatedIsLoading(false);
  };

  const eventsThatIHaveParticipated = async () => {
    const ticketsall = await TicketsApi.getAll();

    if (ticketsall.length === 0) {
      settickets(ticketsall);
      setEventsThatIHaveParticipatedIsLoading(false);
      return;
    }

    ticketsall.map((event) => {
      featureBlockingListener(event.event_id, helperDispatch, 'map');
    });

    const ticketsDataSorted = ticketsall.sort((a, b) => moment(b.created_at) - moment(a.created_at));
    const usersInscription = [];
    ticketsDataSorted.forEach(async (element) => {
      const eventByTicket = await EventsApi.getOne(element.event_id);
      if (eventByTicket) {
        usersInscription.push(eventByTicket);
      }
      settickets(usersInscription);
      setticketsLimited(usersInscription.slice(0, 4));
      setEventsThatIHaveParticipatedIsLoading(false);
    });
  };

  const myOrganizations = async () => {
    const organizations = await OrganizationApi.mine();
    const organizationsFilter = organizations.filter((orgData) => orgData.id);
    const organizationDataSorted = organizationsFilter.sort((a, b) => moment(b.created_at) - moment(a.created_at));
    setorganizations(organizationDataSorted);
    setorganizationsLimited(organizationDataSorted.slice(0, 5));
    setOrganizationsIsLoading(false);
  };

  const fetchItem = async () => {
    /* Eventos creados por el usuario    */
    eventsIHaveCreated();
    /* ----------------------------------*/
    /* Eventos en los que esta inscrito el usuario */

    eventsThatIHaveParticipated();
    /* ----------------------------------*/
    /* Organizaciones del usuario */
    myOrganizations();
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

  useEffect(() => {
    if (activeTab !== '2') return;
    fetchItem();
  }, [activeTab]);

  return (
    <Layout style={{ height: '90.8vh' }}>
      <Sider
        collapsed={collapsed}
        onCollapse={() => showSider()}
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
            {props?.cUser?.value ? (
              <>
                {props?.cUser?.value?.picture ? (
                  <Avatar size={150} src={props?.cUser?.value?.picture} />
                ) : (
                  <Avatar style={{ backgroundColor: '#50D3C9' }} size={150} icon={<UserOutlined />} />
                )}
              </>
            ) : (
              <Skeleton.Avatar active={true} size={150} shape='circle' />
            )}
            <Typography.Text style={{ fontSize: '20px', width: '250px', overflowWrap: 'anywhere' }}>
              {props?.cUser?.value?.names || props?.cUser?.value?.displayName || props?.cUser?.value?.name}
            </Typography.Text>
            <Typography.Text type='secondary' style={{ fontSize: '16px', width: '220px', wordBreak: 'break-all' }}>
              {props?.cUser?.value?.email}
            </Typography.Text>
          </Space>
          <Col span={24}>
            <Menu style={{ border: 'none' }}>
              <Menu.Item
                title={null}
                onClick={() => {
                  showContent('ACCOUNT_ACTIVITY');
                  screens.xs && showSider();
                }}
                key={'actividad'}
                icon={<CarryOutOutlined style={{ fontSize: '18px' }} />}>
                Actividad en Evius
              </Menu.Item>
              {/* RESTRICIONES seccion mi plan */}
              {/* <Menu.Item
                title={null}
                onClick={() => {
                  showContent('MY_PLAN');
                  screens.xs && showSider();
                }}
                key={'myPlan'}
                icon={<CashCheckIcon style={{ fontSize: '22px' }} />}>
                Mi plan
              </Menu.Item> */}
              <Menu.Item
                title={null}
                onClick={() => {
                  showContent('EDIT_INFORMATION');
                  screens.xs && showSider();
                }}
                key={'editarInfo'}
                icon={<EditOutlined style={{ fontSize: '18px' }} />}>
                Editar mi información
              </Menu.Item>
              <Menu.Item
                title={null}
                onClick={() => {
                  showContent('CHANGE_PASSWORD');
                  screens.xs && showSider();
                }}
                key={'cambiarPassword'}
                icon={<LockOutlined style={{ fontSize: '18px' }} />}>
                Cambiar contraseña
              </Menu.Item>
            </Menu>
          </Col>
          <Col>
            <img
              onClick={() => {
                window.location.href = `${window.location.origin}`;
              }}
              style={{
                cursor: 'pointer',
                height: `${screens.xs ? '30px' : '35px'}`,
                // position: 'absolute',
                // bottom: `${screens.xs ? '4%' : '6%'}`,
                // right: `${screens.xs ? '10%' : '22%'}`,
              }}
              src={import.meta.env.VITE_LOGO_SVG}
              alt='logo'
            />
          </Col>
        </Row>
      </Sider>
      <Layout>
        <Content style={{ margin: '0px', padding: '10px', overflowY: 'auto' }}>
          {content === 'CHANGE_PASSWORD' && <ChangePassword email={props?.cUser?.value?.email} />}
          {content === 'EDIT_INFORMATION' && <EditInformation cUser={props.cUser} />}
          {content === 'ACCOUNT_ACTIVITY' && (
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
                  <Row gutter={[16, 2]}>
                    <Col span={24}>
                      <Row gutter={[0, 16]}>
                        <Col
                          style={{ paddingLeft: '30px', paddingRight: '30px' }}
                          xs={24}
                          sm={24}
                          md={12}
                          lg={8}
                          xl={8}
                          xxl={8}>
                          <Card style={{ textAlign: 'center', borderRadius: '15px' }}>
                            <Statistic
                              title={<span style={{ fontSize: '16px' }}>Organizaciones</span>}
                              value={organizations.length && organizations.length > 0 ? organizations.length : 0}
                              // loading={tickets.length ? false : true}
                              precision={0}
                              valueStyle={{ color: '#3f8600', fontSize: '40px' }}
                            />
                          </Card>
                        </Col>
                        <Col
                          style={{ paddingLeft: '30px', paddingRight: '30px' }}
                          xs={24}
                          sm={24}
                          md={12}
                          lg={8}
                          xl={8}
                          xxl={8}>
                          <Card style={{ textAlign: 'center', borderRadius: '15px' }}>
                            <Statistic
                              title={<span style={{ fontSize: '16px' }}>Eventos creados</span>}
                              value={events.length && events.length > 0 ? events.length : 0}
                              // loading={events.length ? false : true}
                              precision={0}
                              valueStyle={{ color: '#3f8600', fontSize: '40px' }}
                            />
                          </Card>
                        </Col>
                        <Col
                          style={{ paddingLeft: '30px', paddingRight: '30px' }}
                          xs={24}
                          sm={24}
                          md={24}
                          lg={8}
                          xl={8}
                          xxl={8}>
                          <Card style={{ textAlign: 'center', borderRadius: '15px' }}>
                            <Statistic
                              title={<span style={{ fontSize: '16px' }}>Eventos en los que estoy inscrito</span>}
                              value={tickets.length && tickets.length > 0 ? tickets.length : 0}
                              // loading={tickets.length ? false : true}
                              precision={0}
                              valueStyle={{ color: '#3f8600', fontSize: '40px' }}
                            />
                          </Card>
                        </Col>
                      </Row>
                    </Col>
                    <Col span={24}>
                      <Divider orientation='left'>Eventos creado</Divider>
                      <Row gutter={[16, 16]}>
                        {eventsIHaveCreatedIsLoading ? (
                          <Loading />
                        ) : (
                          <>
                            <Col xs={24} sm={12} md={12} lg={8} xl={6}>
                              {organizationsLimited.length > 0 ? (
                                <NewCard entityType='event' cUser={props.cUser} org={organizationsLimited} />
                              ) : (
                                <NewCard entityType='event' cUser={props.cUser} />
                              )}
                            </Col>
                            {/* aqui empieza el mapeo de eventCard.jsx maximo 4 */}
                            {eventsLimited.length > 0 &&
                              eventsLimited.map((event, index) => {
                                return (
                                  <Col key={index} xs={24} sm={12} md={12} lg={8} xl={6}>
                                    <EventCard
                                      isAdmin
                                      bordered={false}
                                      event={event}
                                      action={{ name: 'Ver', url: `landing/${event._id}` }}
                                      right={[
                                        <div key={'admin'}>
                                          <Link to={`/eventadmin/${event._id}`}>
                                            <Space>
                                              <SettingOutlined />
                                              <span>Administrar</span>
                                            </Space>
                                          </Link>
                                        </div>,
                                      ]}
                                      blockedEvent={
                                        props?.cUser?.value?.plan?.availables?.later_days || eventCard.value?.later_days
                                      }
                                    />
                                  </Col>
                                );
                              })}
                            {/* aqui termina el mapeo de eventCard.jsx maximo 4  */}
                          </>
                        )}
                      </Row>
                    </Col>

                    <Col span={24}>
                      <Divider orientation='left'>Eventos en los que estoy inscrito</Divider>
                      <Row gutter={[16, 16]}>
                        {eventsThatIHaveParticipatedIsLoading ? (
                          <Loading />
                        ) : (
                          <>
                            {ticketsLimited.length > 0 ? (
                              ticketsLimited.map((event, index) => {
                                return (
                                  <Col key={index} xs={24} sm={12} md={12} lg={8} xl={6}>
                                    <EventCard
                                      bordered={false}
                                      event={event}
                                      action={{ name: 'Ver', url: `landing/${event._id}` }}
                                      /* blockedEvent={
                                        props?.cUser?.value?.plan?.availables?.later_days || eventCard.value?.later_days
                                      } */
                                    />
                                  </Col>
                                );
                              })
                            ) : (
                              <Col span={24}>
                                <ExploreEvents />
                              </Col>
                            )}
                          </>
                        )}
                      </Row>
                    </Col>

                    <Col span={24}>
                      <Divider orientation='left'>Organizaciones</Divider>
                      <Row gutter={[16, 16]}>
                        {organizationsIsLoading ? (
                          <Loading />
                        ) : (
                          <>
                            <Col xs={12} sm={8} md={8} lg={6} xl={4} xxl={4}>
                              <NewCard entityType='organization' cUser={props.cUser} fetchItem={fetchItem} />
                            </Col>
                            {/* aqui empieza el mapeo maximo 6 */}
                            {organizationsLimited.length > 0 &&
                              organizationsLimited.map((organization, index) => {
                                return (
                                  <Col key={index} xs={12} sm={8} md={8} lg={6} xl={4} xxl={4}>
                                    <OrganizationCard data={organization} />
                                  </Col>
                                );
                              })}
                            {/* aqui termina el mapeo maximo 6 */}
                          </>
                        )}
                      </Row>
                    </Col>
                  </Row>
                </TabPane>
              )}
              <TabPane tab='Organizaciones' key='2'>
                {organizationsIsLoading ? (
                  <Loading />
                ) : (
                  <Row gutter={[16, 16]}>
                    <Col xs={12} sm={8} md={8} lg={6} xl={4} xxl={4}>
                      <NewCard entityType='organization' cUser={props.cUser} fetchItem={fetchItem} />
                    </Col>
                    {organizations.length > 0 &&
                      organizations.map((organization, index) => {
                        return (
                          <Col key={index} xs={12} sm={8} md={8} lg={6} xl={4} xxl={4}>
                            <OrganizationCard data={organization} />
                          </Col>
                        );
                      })}
                  </Row>
                )}
              </TabPane>
              <TabPane tab='Eventos creados' key='3'>
                {eventsIHaveCreatedIsLoading ? (
                  <Loading />
                ) : (
                  <Row gutter={[16, 16]}>
                    <Col xs={24} sm={12} md={12} lg={8} xl={6}>
                      {organizationsLimited.length > 0 ? (
                        <NewCard entityType='event' cUser={props.cUser} org={organizationsLimited} />
                      ) : (
                        <NewCard entityType='event' cUser={props.cUser} />
                      )}
                    </Col>
                    {events.map((event, index) => {
                      return (
                        <Col key={index} xs={24} sm={12} md={12} lg={8} xl={6}>
                          <EventCard
                            isAdmin
                            bordered={false}
                            event={event}
                            // action={{ name: 'Ver', url: `landing/${event._id}` }}
                            right={[
                              <div key={'admin'}>
                                <Link to={`/eventadmin/${event._id}`}>
                                  <Space>
                                    <SettingOutlined />
                                    <span>Administrar</span>
                                  </Space>
                                </Link>
                              </div>,
                            ]}
                            /* blockedEvent={
                              props?.cUser?.value?.plan?.availables?.later_days || eventCard.value?.later_days
                            } */
                          />
                        </Col>
                      );
                    })}
                  </Row>
                )}
              </TabPane>
              <TabPane tab='Inscripciones a eventos' key='4'>
                {eventsThatIHaveParticipatedIsLoading ? (
                  <Loading />
                ) : (
                  <Row gutter={[16, 16]}>
                    {tickets.length > 0 ? (
                      tickets.map((event, index) => {
                        return (
                          <Col key={index} xs={24} sm={12} md={12} lg={8} xl={6}>
                            <EventCard
                              bordered={false}
                              event={event}
                              action={{ name: 'Ver', url: `landing/${event._id}` }}
                              /* blockedEvent={
                                props?.cUser?.value?.plan?.availables?.later_days || eventCard.value?.later_days
                              } */
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
                )}
              </TabPane>
            </Tabs>
          )}
          {content === 'MY_PLAN' && <MyPlan cUser={props.cUser} />}
        </Content>
      </Layout>
    </Layout>
  );
};

export default withContext(MainProfile);
