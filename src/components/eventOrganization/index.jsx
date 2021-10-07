import { Col, Row, Typography, Badge, Spin, Space, Divider } from 'antd';
import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { OrganizationFuction } from '../../helpers/request';
import EventCard from '../shared/eventCard';
import moment from 'moment';
import ModalAuth from '../authentication/ModalAuth';
import ModalLoginHelpers from '../authentication/ModalLoginHelpers';

const { Title, Text } = Typography;

class EventOrganization extends Component {
  constructor(props) {
    super(props);
    this.state = {
      events: [],
      eventsOld: [],
      organization: null,
      orgId: null,
      loading: true,
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
    let proximos=[]
    let pasados=[]
    let fechaActual= moment();
    events.map((event)=>{
      if (moment(event.datetime_from).isAfter(fechaActual)){
          proximos.push(event)
      }else{
        pasados.push(event)
      }       
    })

    const organization = await OrganizationFuction.obtenerDatosOrganizacion(orgId);
    if (events) {
      this.setState({ events:proximos,eventsOld:pasados,organization, loading: false });
    }
  };

  render() {
    return (
      <React.Fragment>
        <ModalAuth organization={"landing"} idOrganization={this.props.match.params.id} />
        <ModalLoginHelpers />
        {!this.state.loading && this.state.orgId ? (
          <>
            {/* BANNER */}
            {this.state.organization && (
              <div style={{ width: '100%', maxHeight: '350px' }}>
                {!this.state.organization.banner_image_email == '' ? (
                  <img style={{ objectFit: 'cover', width: '100%' }} src={this.state.organization.banner_image_email} />
                ) : (
                  ''
                )}
              </div>
            )}

            <div style={{ padding: '5vw' }}>
              {this.state.organization && (
                <div style={{ marginBottom: '50px',marginTop:'20px' }}>
                  <Space direction='vertical' size={5}>
                    <Text style={{ marginBottom: '-15px', fontSize: '20px' }}>Organizador</Text>
                    <Text style={{ fontSize: '40px', fontWeight: '600', lineHeight: '2.25rem' }} type='secondary'>
                      {this.state.organization.name}
                    </Text>
                  </Space>
                </div>
              )}
              {/* Lista de evntos próximos */}
              <div>
                <Badge offset={[60, 22]} count={`${this.state.events.length} Eventos`}>
                  <Title level={2}>Próximos</Title>
                </Badge>
                <Row gutter={[16, 16]}>
                  {this.state.events &&
                    this.state.events.map((event, index) => (
                      <Col key={index} xs={24} sm={12} md={12} lg={8} xl={6}>
                        <EventCard
                          bordered={false}
                          key={event._id}
                          event={event}
                          action={{ name: 'Ver', url: `landing/${event._id}` }}
                        />
                      </Col>
                    ))}
                </Row>
              </div>
              <Divider />
              {/* Lista de eventos pasados */}
              <div>
                <Badge offset={[60, 22]} count={`${this.state.eventsOld.length} Eventos`}>
                  <Title level={2}>Pasados</Title>
                </Badge>
                <Row gutter={[16, 16]}>
                  {this.state.eventsOld &&
                    this.state.eventsOld.map((event, index) => (
                      <Col key={index} xs={24} sm={12} md={12} lg={8} xl={6}>
                        <EventCard
                          bordered={false}
                          key={event._id}
                          event={event}
                          action={{ name: 'Ver', url: `landing/${event._id}` }}
                        />
                      </Col>
                    ))}
                </Row>
              </div>
            </div>
            {/* FOOTER */}
            {this.state.organization && (
              <div style={{ width: '100%', maxHeight: '350px' }}>
                {!this.state.organization.footer_image_email == '' ? (
                  <img style={{ objectFit: 'cover', width: '100%' }} src={this.state.organization.footer_image_email} />
                ) : (
                  ''
                )}
              </div>
            )}
          </>
        ) : (
          <div style={{ width: '100vw', height: '100vh', textAlign: 'center', paddingTop: '20%' }}>
            <Spin size='large' />
          </div>
        )}
      </React.Fragment>
    );
  }
}

export default withRouter(EventOrganization);
