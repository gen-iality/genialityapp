/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-console */
/* eslint-disable array-callback-return */
/* eslint-disable jsx-a11y/alt-text */
import { Col, Row, Badge, Space, Image, Empty, Button, Typography, Card } from 'antd';
import { useEffect, useState } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { OrganizationApi, OrganizationFuction } from '../../helpers/request';
import EventCard from '../shared/eventCard';
import moment from 'moment';
import ModalLoginHelpers from '../authentication/ModalLoginHelpers';
import { EditOutlined } from '@ant-design/icons';
import Loading from '../profile/loading';
import { DataOrganizations, Organization, OrganizationProps } from './types';
import { UseCurrentUser } from '@/context/userContext';
import { useGetEventsWithUser } from './hooks/useGetEventsWithUser';
import { ModalCertificatesByOrganizacionAndUser } from './components/ModalCertificatesByOrganizacionAndUser';

function EventOrganization({ match }: OrganizationProps) {
  const { Title, Text, Paragraph } = Typography;
  const cUser = UseCurrentUser();
  const [state, setstate] = useState<DataOrganizations>({
    orgId: '',
    view: false,
  });
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [events, setEvents] = useState<any[]>([]);
  const [eventsOld, setEventsOld] = useState<any[]>([]);
  const [myOrganizations, setMyorganizations] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isModalCertificatesOpen, setIsModalCertificatesOpen] = useState(false);
  const { eventsWithEventUser, isLoading: isLoadingOtherEvents } = useGetEventsWithUser(
    match.params.id,
    cUser.value?._id
  );

  useEffect(() => {

    let orgId = match.params.id;
    if (orgId) {
      
      fetchItem(orgId).then((respuesta) =>
        setstate({
          ...state,
          orgId,
        })
      );
      getMyOrganizations()
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (cUser.value) {
      getMyOrganizations();
    } else {
      setMyorganizations([]);
    }
  }, [cUser.value]);

  const getMyOrganizations = async () => {
    try {
      const organizations: Organization[] = await OrganizationApi.mine();
      if (organizations?.length > 0) {
        setMyorganizations(organizations.map((item) => item.id));
      }
    } catch (error) {
      console.log('[debug] organization not found');
    }
  };

  const fetchItem = async (orgId: string) => {
    const events = await OrganizationFuction.getEventsNextByOrg(orgId);
    let proximos: any = [];
    let pasados: any = [];
    let fechaActual = moment();
    events.map((event: any) => {
      if (moment(event.datetime_from).isAfter(fechaActual)) {
        proximos.push(event);
      } else {
        pasados.push(event);
      }
    });

    const orga = await OrganizationFuction.obtenerDatosOrganizacion(orgId);
    if (events) {
      setEvents(proximos);
      setEventsOld(pasados);
      setOrganization(orga);
    }
    setLoading(false);
  };

  //toDo: Se debe realizar esta validacion desde el backedn para mejor optimizacion
  const isUserRegisterInEvent = (eventId: string): boolean => {
    if (eventsWithEventUser.filter((event) => event._id === eventId).length > 0) {
      return true;
    }
    return false;
  };

  const getTextButtonBuyOrRegistered = (event: any): string => {
    if (isUserRegisterInEvent(event._id)) {
      return 'Ingresar';
    }
    if (havePaymentEvent(event)) {
      if (event.payment.externalPayment) {
        return 'Comprar';
      } else {
        return `Comprar por $ ${event.payment.price} ${event?.payment?.currency}`;
      }
    }

    return 'Inscribirse';
  };

  const havePaymentEvent = (event: any): boolean => {
    return event.payment ? (event.payment.active as boolean) : false;
  };

  return (
    <div
      style={{
        backgroundImage: `url(${organization?.styles?.BackgroundImage})`,
        backgroundColor: `${organization?.styles?.containerBgColor || '#FFFFFF'}`,
      }}>
      <ModalLoginHelpers />
      {!loading && state.orgId ? (
        <>
          {organization !== null && (
            <div style={{ width: '100%' }}>
              {organization.styles?.banner_image !== null || '' ? (
                <img
                  style={{ objectFit: 'cover', width: '100%', maxHeight: '400px' }}
                  src={organization.styles?.banner_image}
                />
              ) : (
                ''
              )}
            </div>
          )}

          <Row justify='center' style={{ paddingTop: '32px', paddingBottom: '32px' }}>
            <Col span={23}>
              <Row gutter={[0, 32]}>
                {organization && (
                  <Col style={{ width: '100%' }}>
                    <Card style={{ width: '100%', borderRadius: 20 }}>
                      <Row gutter={[10, 10]} style={{ width: '100%' }}>
                        <Col xs={24} sm={24} md={24} lg={8} xl={4} xxl={4}>
                          <Row justify={'start'}>
                            <Image
                              style={{
                                borderRadius: '20px',
                                objectFit: 'cover',
                                border: '4px solid #FFFFFF',
                                //boxShadow: '2px 2px 10px 1px rgba(0,0,0,0.25)',
                                backgroundColor: '#FFFFFF;',
                              }}
                              preview={{ maskClassName: 'roundedMask' }}
                              src={organization?.styles?.event_image || 'error'}
                              fallback='http://via.placeholder.com/500/F5F5F7/CCCCCC?text=No%20Image'
                              width={'100%'}
                              height={'100%'}
                            />
                          </Row>
                        </Col>
                        <Col xs={24} sm={24} md={24} lg={16} xl={20} xxl={20}>
                          <Space direction='vertical' size={8} style={{ width: '100%' }}>
                            <Link
                              to={`/admin/organization/${match.params.id}`}
                              style={{
                                marginBottom: '-15px',
                                fontSize: '20px',
                                cursor: 'pointer',
                              }}>
                              {cUser?.value && myOrganizations.includes(state.orgId) && (
                                <Button type='text' icon={<EditOutlined />}>
                                  Administrar
                                </Button>
                              )}
                            </Link>
                            <Text
                              style={{
                                fontSize: '30px',
                                fontWeight: '600',
                                lineHeight: '2.25rem',
                              }}>
                              Bienvenido a
                            </Text>
                            <Text
                              style={{
                                fontSize: '40px',
                                fontWeight: '600',
                                lineHeight: '2.25rem',
                              }}
                              type='secondary'>
                              {organization.name}
                            </Text>
                            <Paragraph
                              ellipsis={{
                                rows: 3,
                                expandable: true,
                                symbol: <span style={{ color: '#2D7FD6', fontSize: '12px' }}>Ver más</span>,
                              }}>
                              {organization.description ? organization.description : ''}
                            </Paragraph>
                          </Space>
                        </Col>
                      </Row>
                    </Card>
                  </Col>
                )}
                {cUser.value && (
                  <Col style={{ width: '100%' }}>
                    {/* Lista otros eventos en los que esta inscrito el usuario*/}
                    <Card style={{ width: '100%', borderRadius: 20 }}>
                      <Row justify='space-between'>
                        <Badge offset={[60, 22]} count={`${eventsWithEventUser.length} Eventos`}>
                          <Title level={2}>Mis eventos</Title>
                        </Badge>
                        <Button type='primary' onClick={() => setIsModalCertificatesOpen(true)}>
                          Ver mis certificados
                        </Button>
                      </Row>
                      {isModalCertificatesOpen && (
                        <ModalCertificatesByOrganizacionAndUser
                          visible={isModalCertificatesOpen}
                          onClose={() => setIsModalCertificatesOpen(false)}
                          eventsWithEventUser={eventsWithEventUser}
                        />
                      )}
                      <Row gutter={[16, 16]}>
                        {isLoadingOtherEvents && (
                          <div style={{ width: '100vw', height: '100vh', textAlign: 'center' }}>
                            <Loading />
                          </div>
                        )}
                        {!isLoadingOtherEvents && eventsWithEventUser && eventsWithEventUser.length > 0 ? (
                          eventsWithEventUser.map((event, index) => (
                            <Col key={index} xs={24} sm={12} md={12} lg={8} xl={6}>
                              <EventCard
                                bordered={false}
                                key={event._id}
                                event={event}
                                action={{ name: 'Ver', url: `landing/${event._id}` }}
                              />
                            </Col>
                          ))
                        ) : (
                          <div
                            style={{
                              height: '250px',
                              width: '100%',
                              display: 'flex',
                              justifyContent: 'center',
                              alignItems: 'center',
                            }}>
                            <Empty description='No estas inscritos en otros eventos' />
                          </div>
                        )}
                      </Row>
                    </Card>
                  </Col>
                )}

                <Col style={{ width: '100%' }}>
                  {/* Lista de eventos próximos */}
                  <Card style={{ width: '100%', borderRadius: 20 }}>
                    <Badge offset={[60, 22]} count={`${events.length} Eventos`}>
                      <Title level={2}>Eventos próximos</Title>
                    </Badge>
                    <Row gutter={[16, 16]}>
                      {events && events.length > 0 ? (
                        events.map((event, index) => (
                          <Col key={index} xs={24} sm={12} md={12} lg={8} xl={6}>
                            <EventCard
                              bordered={false}
                              key={event._id}
                              event={event}
                              action={{ name: 'Ver', url: `landing/${event._id}` }}
                            />
                          </Col>
                        ))
                      ) : (
                        <div
                          style={{
                            height: '250px',
                            width: '100%',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}>
                          <Empty description='No hay eventos próximos agendados' />
                        </div>
                      )}
                    </Row>
                  </Card>
                </Col>
                <Col style={{ width: '100%' }}>
                  <Card style={{ width: '100%', borderRadius: 20 }}>
                    {/* Lista de eventos pasados */}
                    <Badge offset={[60, 22]} count={`${eventsOld.length} Eventos`}>
                      <Title level={2}>Eventos pasados</Title>
                    </Badge>
                    <Row gutter={[16, 16]}>
                      {eventsOld && eventsOld.length > 0 ? (
                        eventsOld.map((event, index) => {
                          if(event.hide_event_in_passed){
                            return null
                          }
                          return (
                            <Col key={index} xs={24} sm={12} md={12} lg={8} xl={6}>
                              <EventCard
                                bordered={false}
                                key={event._id}
                                event={event}
                                action={{ name: 'Ver', url: `landing/${event._id}` }}
                                buttonBuyOrRegistered
                                textButtonBuyOrRegistered={getTextButtonBuyOrRegistered(event)}
                              />
                            </Col>
                          )
                        })
                      ) : (
                        <div
                          style={{
                            height: '250px',
                            width: '100%',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}>
                          <Empty description='No hay eventos pasados' />
                        </div>
                      )}
                    </Row>
                  </Card>
                </Col>
              </Row>
            </Col>
          </Row>
          {/* FOOTER */}
          {organization !== null && (
            <div style={{ width: '100%', maxHeight: '350px' }}>
              {organization.styles?.banner_footer || '' ? (
                <img
                  style={{ objectFit: 'cover', width: '100%', maxHeight: '250px' }}
                  src={organization.styles?.banner_footer}
                />
              ) : (
                ''
              )}
            </div>
          )}
        </>
      ) : (
        <div style={{ width: '100vw', height: '100vh', textAlign: 'center' }}>
          <Loading />
        </div>
      )}
    </div>
  );
}
export default withRouter(EventOrganization);
