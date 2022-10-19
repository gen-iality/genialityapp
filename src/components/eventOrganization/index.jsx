import { Col, Row, Typography, Badge, Grid, Space, Divider, Image, Empty, Button } from 'antd';
import { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { OrganizationFuction } from '@helpers/request';
import EventCard from '../shared/eventCard';
import dayjs from 'dayjs';
import ModalAuth from '../authentication/ModalAuth';
import ModalLoginHelpers from '../authentication/ModalLoginHelpers';
import {
  EditOutlined,
  FacebookOutlined,
  GlobalOutlined,
  InstagramOutlined,
  LeftOutlined,
  RightOutlined,
} from '@ant-design/icons';
import Loading from '../profile/loading';

const { Title, Text, Paragraph } = Typography;
class EventOrganization extends Component {
  constructor(props) {
    super(props);
    this.state = {
      events: [],
      eventsOld: [],
      organization: null,
      orgId: null,
      loading: true,
      view: false,
    };
  }

  componentDidMount() {
    let orgId = this.props.match.params.id;
    if (orgId) {
      this.fetchItem(orgId).then((respuesta) =>
        this.setState({
          orgId,
          loading: false,
        })
      );
    }
  }
  //Obtener los datos necesarios de la organización
  fetchItem = async (orgId) => {
    const events = await OrganizationFuction.getEventsNextByOrg(orgId);
    let proximos = [];
    let pasados = [];
    let fechaActual = dayjs();
    events.map((event) => {
      if (dayjs(event.datetime_from).isAfter(fechaActual)) {
        proximos.push(event);
      } else {
        pasados.push(event);
      }
    });

    const organization = await OrganizationFuction.obtenerDatosOrganizacion(orgId);
    if (events) {
      this.setState({
        events: proximos,
        eventsOld: pasados,
        organization,
        loading: false,
      });
    }
  };

  handleView = () => {
    let ver = this.state.view;
    this.setState({ view: !ver });
  };

  render() {
    return (
      <div
        style={{
          backgroundImage: `url(${this.state.organization?.styles?.BackgroundImage})`,
          backgroundColor: `${this.state.organization?.styles?.containerBgColor || '#FFFFFF'}`,
        }}>
        {console.log('Org', this.state.organization)}
        {/* <ModalAuth
          organization={'landing'}
          idOrganization={this.props.match.params.id}
          logo={this.state.organization?.styles?.event_image}
        /> */}
        <ModalLoginHelpers />
        {!this.state.loading && this.state.orgId ? (
          <>
            {/* BANNER */}
            {this.state.organization !== null && (
              <div style={{ width: '100%' }}>
                {this.state.organization.styles?.banner_image !== null || '' ? (
                  <img
                    style={{ objectFit: 'cover', width: '100%', maxHeight: '400px' }}
                    src={this.state.organization.styles?.banner_image}
                  />
                ) : (
                  ''
                )}
                {/* <Space
                  direction='horizontal'
                  size={10}
                  style={{
                    position: 'fixed',
                    top: '100px',
                    left: `${this.state.view ? '0px' : '-110px'}`,
                    backgroundColor: '#FFFFFF',
                    borderRadius: '2px',
                    padding: '10px',
                    zIndex: 5,
                    transition: '1s all',
                  }}>
                  <InstagramOutlined style={{ fontSize: '25px', color: '#8C8C8C' }} />
                  <FacebookOutlined style={{ fontSize: '25px', color: '#8C8C8C' }} />
                  <GlobalOutlined style={{ fontSize: '25px', color: '#8C8C8C' }} />
                  {this.state.view ? (
                    <LeftOutlined onClick={this.handleView} style={{ fontSize: '25px', color: '#007ACC' }} />
                  ) : (
                    <RightOutlined onClick={this.handleView} style={{ fontSize: '25px', color: '#007ACC' }} />
                  )}
                </Space> */}
              </div>
            )}

            <div
              style={{
                paddingLeft: '5vw',
                paddingRight: '5vw',
                paddingBottom: '5vw',
                paddingTop: '0.5vw',
              }}>
              {this.state.organization && (
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
                        src={this.state.organization?.styles?.event_image || 'error'}
                        fallback='http://via.placeholder.com/500/F5F5F7/CCCCCC?text=No%20Image'
                        width={'100%'}
                        height={'100%'}
                      />
                    </Row>
                  </Col>
                  <Col xs={24} sm={24} md={24} lg={16} xl={20} xxl={20}>
                    <Space direction='vertical' size={8} style={{ width: '100%' }}>
                      <Link
                        to={`/admin/organization/${this.props.match.params.id}`}
                        style={{
                          marginBottom: '-15px',
                          fontSize: '20px',
                          cursor: 'pointer',
                        }}>
                        <Button type='text' icon={<EditOutlined />}>
                          Administrar
                        </Button>
                      </Link>
                      <Text
                        style={{
                          fontSize: '40px',
                          fontWeight: '600',
                          lineHeight: '2.25rem',
                        }}
                        type='secondary'>
                        {this.state.organization.name}
                      </Text>
                      <Paragraph
                        ellipsis={{
                          rows: 3,
                          expandable: true,
                          symbol: <span style={{ color: '#2D7FD6', fontSize: '12px' }}>Ver más</span>,
                        }}>
                        {this.state.organization.description ? this.state.organization.description : ''}
                      </Paragraph>
                    </Space>
                  </Col>
                </Row>
              )}
              {/* Lista de cursos próximos */}
              <div
                style={{
                  backgroundColor: '#FFFFFF',
                  padding: '20px',
                  borderRadius: '20px',
                }}>
                <Badge offset={[60, 22]} count={`${this.state.events.length} Cursos`}>
                  <Title level={2}>Próximos</Title>
                </Badge>
                <Row gutter={[16, 16]}>
                  {this.state.events && this.state.events.length > 0 ? (
                    this.state.events.map((event, index) => (
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
                      <Empty description='No hay cursos próximos agendados' />
                    </div>
                  )}
                </Row>
              </div>
              <Divider />
              {/* Lista de cursos pasados */}
              <div
                style={{
                  backgroundColor: '#FFFFFF',
                  padding: '20px',
                  borderRadius: '20px',
                }}>
                <Badge offset={[60, 22]} count={`${this.state.eventsOld.length} Cursos`}>
                  <Title level={2}>Pasados</Title>
                </Badge>
                <Row gutter={[16, 16]}>
                  {this.state.eventsOld && this.state.eventsOld.length > 0 ? (
                    this.state.eventsOld.map((event, index) => (
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
                      <Empty description='No hay cursos pasados' />
                    </div>
                  )}
                </Row>
              </div>
            </div>
            {/* FOOTER */}
            {this.state.organization !== null && (
              <div style={{ width: '100%', maxHeight: '350px' }}>
                {this.state.organization.styles?.banner_footer || '' ? (
                  <img
                    style={{ objectFit: 'cover', width: '100%', maxHeight: '250px' }}
                    src={this.state.organization.styles?.banner_footer}
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
}

export default withRouter(EventOrganization);
