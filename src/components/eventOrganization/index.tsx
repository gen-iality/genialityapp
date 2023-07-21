import { Col, Row, Badge, Grid, Space, Divider, Image, Empty, Button, Typography } from 'antd';
import { useEffect, useState } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { OrganizationApi, OrganizationFuction } from '../../helpers/request';
import EventCard from '../shared/eventCard';
import moment from 'moment';
import ModalAuth from '../authentication/ModalAuth';
import ModalLoginHelpers from '../authentication/ModalLoginHelpers';
import { EditOutlined } from '@ant-design/icons';
import Loading from '../profile/loading';
import { DataOrganizations, Organization, OrganizationProps } from './types';
import { UseCurrentUser } from '@/context/userContext';


function EventOrganization({match}: OrganizationProps) {
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

  useEffect(()=>{
    if(cUser.value){
      getMyOrganizations()
    }else{
      setMyorganizations([])
    }
  },[cUser.value])

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
      setEvents(proximos)
      setEventsOld(pasados)
      setOrganization(orga)
    }
    setLoading(false);
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

          <div
            style={{
              paddingLeft: '5vw',
              paddingRight: '5vw',
              paddingBottom: '5vw',
              paddingTop: '0.5vw',
            }}>
            {organization && (
              <Row
                gutter={[10, 10]}
                style={{
                  marginBottom: '40px',
                  marginTop: '20px',
                  backgroundColor: '#FFFFFF',
                  padding: '10px',
                  borderRadius: '20px',
                }}>
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
            )}
            {/* Lista de eventos próximos */}
            <div
              style={{
                backgroundColor: '#FFFFFF',
                padding: '20px',
                borderRadius: '20px',
              }}>
              <Badge offset={[60, 22]} count={`${events.length} Eventos`}>
                <Title level={2}>Próximos</Title>
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
            </div>
            <Divider />
            {/* Lista de eventos pasados */}
            <div
              style={{
                backgroundColor: '#FFFFFF',
                padding: '20px',
                borderRadius: '20px',
              }}>
              <Badge offset={[60, 22]} count={`${eventsOld.length} Eventos`}>
                <Title level={2}>Pasados</Title>
              </Badge>
              <Row gutter={[16, 16]}>
                {eventsOld && eventsOld.length > 0 ? (
                  eventsOld.map((event, index) => (
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
                    <Empty description='No hay eventos pasados' />
                  </div>
                )}
              </Row>
            </div>
          </div>
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
