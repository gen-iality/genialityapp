import React, { Component, Fragment } from "react";

import "react-toastify/dist/ReactToastify.css";
import { Row, Button, Col, Card, Avatar, Alert, Tabs, message, notification, Select  } from "antd";

import { SmileOutlined } from '@ant-design/icons';

import AppointmentModal from "./appointmentModal";
import MyAgenda from "./myAgenda";
import AppointmentRequests from "./appointmentRequests";
import SearchComponent from "../shared/searchTable";
import Pagination from "../shared/pagination";
import Loading from "../loaders/loading";
import EventContent from "../events/shared/content";

import * as Cookie from "js-cookie";
import API, { EventsApi, RolAttApi, EventFieldsApi } from "../../helpers/request";

import { getCurrentUser, getCurrentEventUser, userRequest } from "./services";

import ContactList from "./contactList";
import RequestList from "./requestList";

const { Option } = Select;
const { Meta } = Card;
const { TabPane } = Tabs;

export default class ListEventUser extends Component {
  constructor( props ) {
    super( props );
    this.state = {
      userReq: [],
      users: [],
      pageOfItems: [],
      clearSearch: false,
      loading: true,
      changeItem: false,
      activeTab: 'asistentes',
      eventUserId: null,
      currentUserName: null,
      eventUserIdToMakeAppointment: '',
      asistantData: [],
      matches: []
    };
  }

  async componentDidMount () {
    await this.getInfoCurrentUser();
    this.loadData();
  }

  changeActiveTab = ( activeTab ) => {
    this.setState( { activeTab } )
  }

  closeAppointmentModal = () => {
    this.setState( { eventUserIdToMakeAppointment: '' } )
  }

  loadData = async () => {
    let { changeItem } = this.state;
    const { event } = this.props;

    // Servicio que trae la lista de asistentes excluyendo el usuario logeado
    let eventUserList = await userRequest.getEventUserList( event._id, Cookie.get( "evius_token" ) );

    /** Inicia destacados
     * Búscamos usuarios destacados para colocarlos de primeros en la lista(destacados), tiene varios usos cómo publicitarios
     * estos tienen una propiedad llamada destacados, en un futuro debemos poner esto cómo un rol de asistente para facilitar 
     * la administración por el momento este valor se esta quemando directamente en la base de datos
     */
    let destacados = [];
    destacados = eventUserList.filter( asistente => ( asistente.destacado && asistente.destacado == true ) )

    if ( destacados && destacados.length >= 0 ) {
      eventUserList = [ ...destacados, ...eventUserList ]
    }
    //Finaliza destacados

    //Búscamos usuarios sugeridos según el campo sector esto es para el proyecto FENALCO
    let matches = [];
    if ( this.state.eventUser ) {
      let meproperties = this.state.eventUser.properties;
      matches = eventUserList.filter( asistente => ( asistente.properties.sector && asistente.properties && meproperties && meproperties.priorizarsectoresdeinteres && ( meproperties.priorizarsectoresdeinteres.match( new RegExp( asistente.properties.sector, 'gi' ) ) || asistente.properties.sector.match( new RegExp( meproperties.priorizarsectoresdeinteres, 'gi' ) ) ) ) )
    }

    console.log( "eventUserList: Matched", matches, eventUserList, this.state.eventUser );







    let asistantData = await EventFieldsApi.getAll( event._id )

    this.setState( ( prevState ) => {
      return {
        userReq: eventUserList,
        users: eventUserList,
        changeItem,
        loading: false,
        clearSearch: !prevState.clearSearch,
        asistantData,
        matches
      };
    } );
  };

  // Funcion que trae el eventUserId del usuario actual
  getInfoCurrentUser = async () => {
    const { event } = this.props;
    let currentUser = Cookie.get( "evius_token" );

    if ( currentUser ) {
      let user = await getCurrentUser( currentUser );

      const eventUser = await getCurrentEventUser( event._id, user._id );

      // Servicio que trae la lista de asistentes excluyendo el usuario logeado
      //let eventUserList = await userRequest.getEventUserList( event._id, Cookie.get( "evius_token" ) );
      this.setState( { eventUser, eventUserId: eventUser._id, currentUserName: eventUser.names || eventUser.email } );

    }
  };

  onChangePage = ( pageOfItems ) => {
    this.setState( { pageOfItems: pageOfItems } );
  };

  //Search records at third column
  searchResult = ( data ) => {
    !data ? this.setState( { users: [] } ) : this.setState( { users: data } );
  };

  async SendFriendship ( { eventUserIdReceiver, userName } ) {
    let { eventUserId, currentUserName } = this.state;
    let currentUser = Cookie.get( "evius_token" );

    message.loading( "Enviando solicitud" );
    if ( currentUser ) {
      // Se valida si el usuario esta suscrito al evento
      if ( eventUserId ) {
        // Se usan los EventUserId
        const data = {
          id_user_requested: eventUserId,
          id_user_requesting: eventUserIdReceiver,
          user_name_requested: currentUserName,
          user_name_requesting: userName,
          event_id: this.props.event._id,
          state: "send",
        };

        // console.log("data:", data);

        // Se ejecuta el servicio del api de evius
        try {
          const response = await EventsApi.sendInvitation( this.props.event._id, data );
          console.log( "Esta es la respuesta:", response );
          notification.open( {
            message: 'Solicitud enviada',
            description:
              'Le llegará un correo a la persona notificandole la solicitud, quién la aceptara o recharaza. Una vez la haya aceptado te llegará un correo confirmando y podrás regresar a esta misma sección en mis contactos a ver la información completa del nuevo contacto.',
            icon: <SmileOutlined style={ { color: '#108ee9' } } />,
            duration: 30
          } );



        } catch ( err ) {
          let { data } = err.response;
          message.warning( data.message );
        }
      } else {
        message.warning( "No es posible enviar solicitudes. No se encuentra suscrito al evento" );
      }
    } else {
      message.warning( "Para enviar la solicitud es necesario iniciar sesión" );
    }
  }

  render () {
    const { event } = this.props;
    const {
      userReq,
      users,
      pageOfItems,
      eventUserId,
      eventUser,
      asistantData,
      eventUserIdToMakeAppointment,
      activeTab,
      matches
    } = this.state;

    return (
      <React.Fragment style={ { width: "86.66667%" } }>
        <EventContent>
          {/* Componente de busqueda */ }
          <Tabs activeKey={ activeTab } onChange={ this.changeActiveTab }>

            <TabPane tab="Sugeridos" key="sugeridos">
              <AppointmentModal
                event={ event }
                currentEventUserId={ eventUserId }
                targetEventUserId={ eventUserIdToMakeAppointment }
                closeModal={ this.closeAppointmentModal }
              />
              <Col xs={ 22 } sm={ 22 } md={ 10 } lg={ 10 } xl={ 10 } style={ { margin: "0 auto" } }>
                <h1> Encuentra aquí tus contactos sugeridos, basados en la información de registro al evento.</h1>

              </Col>
              <Col xs={ 22 } sm={ 22 } md={ 10 } lg={ 10 } xl={ 10 } style={ { margin: "0 auto" } }>
                <Alert
                  message="Información Adicicional"
                  description="Solo puedes ver una cantidad de información pública limitada de cada asistente, para ver toda la información de otro asistente debes realizar una solicitud de contacto
                  se le informara al asistente quien aceptara o recharaza la solicitud, Una vez la haya aceptado te llegará un correo confirmando y podrás regresar a esta misma sección en mis contactos a ver la información completa del nuevo contacto."
                  type="info"
                  closable
                />
              </Col>
              { !this.state.loading && !eventUserId && (
                <div>
                  <br />
                  <Col xs={ 22 } sm={ 22 } md={ 10 } lg={ 10 } xl={ 10 } style={ { margin: "0 auto" } }>
                    <Alert
                      message="Solicitudes"
                      description="Para enviar solicitudes debes estar suscrito al evento"
                      type="info"
                      closable
                    />
                  </Col>
                </div>
              ) }

              <div style={ { marginTop: 10 } }>
                { this.state.loading ? (
                  <Fragment>
                    <Loading />
                    <h2 className="has-text-centered">Cargando...</h2>
                  </Fragment>
                ) : (
                    <div className="card-Networking">
                      <div className="container" justify="center">
                        <Row gutter={ [ 20, 20 ] }>
                          {/* Mapeo de datos en card, Se utiliza Row y Col de antd para agregar columnas */ }
                          { matches.map( ( users, userIndex ) => (
                            <Col key={ `user-item-${ userIndex }` } xs={ 24 } sm={ 24 } md={ 24 } lg={ 18 } xl={ 18 } style={ { marginRight: 12 } }>
                              <Card
                                extra={
                                  <a
                                    onClick={ () => {
                                      this.SendFriendship( {
                                        eventUserIdReceiver: users._id,
                                        userName: users.properties.names || users.properties.email,
                                      } );
                                    } }>

                                  </a>
                                }
                                hoverable={ 8 }
                                headStyle={ ( users.destacado && users.destacado == true ) ? { backgroundColor: "#33FFEC" } : { backgroundColor: event.styles.toolbarDefaultBg } }
                                style={ { width: 500, marginTop: "2%", marginBottom: "2%", textAlign: "left" } }
                                bordered={ true }>
                                <Meta
                                  avatar={
                                    <Avatar>
                                      { users.properties.names
                                        ? users.properties.names.charAt( 0 ).toUpperCase()
                                        : users.properties.names }
                                    </Avatar>
                                  }
                                  title={ users.properties.names ? users.properties.names : "No registra Nombre" }
                                  description={ [
                                    <div>
                                      <br />
                                      <Row>
                                        <Col xs={ 24 }>
                                          <div>
                                            {
                                              asistantData.map( ( data, dataIndex ) => (
                                                !data.privatePublic && data.privatePublic !== undefined && users.properties[ data.name ] && (
                                                  <div key={ `public-field-${ userIndex }-${ dataIndex }` }>
                                                    <p><b>{ data.label }:</b> { users.properties[ data.name ] }</p>
                                                  </div>
                                                )
                                              ) )
                                            }
                                          </div>
                                        </Col>
                                        <Col xs={ 24 }>
                                          <Button
                                            type="primary"
                                            onClick={ () => {
                                              this.setState( { eventUserIdToMakeAppointment: users._id } )
                                            } }
                                          >
                                            { 'Agendar cita' }
                                          </Button>
                                        </Col>
                                      </Row>
                                      <br />
                                    </div>,
                                  ] }
                                />
                              </Card>
                            </Col>
                          ) ) }
                        </Row>
                      </div>

                    </div>
                  ) }
              </div>
            </TabPane>



            <TabPane tab="Todos los Asistentes" key="asistentes">
              <AppointmentModal
                event={ event }
                currentEventUserId={ eventUserId }
                targetEventUserId={ eventUserIdToMakeAppointment }
                closeModal={ this.closeAppointmentModal }
              />
              <Col xs={ 22 } sm={ 22 } md={ 10 } lg={ 10 } xl={ 10 } style={ { margin: "0 auto" } }>
                <h1> Busca aquí las personas que deseas contactar.</h1>

                <SearchComponent
                  placeholder={ "" }
                  data={ userReq }
                  kind={ "user" }
                  event={ this.props.event._id }
                  searchResult={ this.searchResult }
                  clear={ this.state.clearSearch }
                />


              </Col>
              <Col xs={ 22 } sm={ 22 } md={ 10 } lg={ 10 } xl={ 10 } style={ { margin: "0 auto" } }>
                <h1> Busca aquí las personas que deseas contactar.</h1>

                <Select defaultValue="lucy" style={{ width: 120 }} >
                  <Option value="jack">Automotores</Option>
                  <Option value="lucy">Tecnología y telecomunicaciones</Option>
                  <Option value="Yiminghe">Artículos para el hogar</Option>
                  <Option value="Yiminghe">Ferreterías y materiales de construcción</Option>
                  <Option value="Yiminghe">Joyerías y accesorios de lujo</Option>
                  <Option value="Yiminghe">Servicios al comercio</Option>
                </Select>


              </Col>
              <Col xs={ 22 } sm={ 22 } md={ 10 } lg={ 10 } xl={ 10 } style={ { margin: "0 auto" } }>
                <Alert
                  message="Información Adicicional"
                  description="Solo puedes ver una cantidad de información pública limitada de cada asistente, para ver toda la información de otro asistente debes realizar una solicitud de contacto
                  se le informara al asistente quien aceptara o recharaza la solicitud, Una vez la haya aceptado te llegará un correo confirmando y podrás regresar a esta misma sección en mis contactos a ver la información completa del nuevo contacto."
                  type="info"
                  closable
                />
              </Col>
              { !this.state.loading && !eventUserId && (
                <div>
                  <br />
                  <Col xs={ 22 } sm={ 22 } md={ 10 } lg={ 10 } xl={ 10 } style={ { margin: "0 auto" } }>
                    <Alert
                      message="Solicitudes"
                      description="Para enviar solicitudes debes estar suscrito al evento"
                      type="info"
                      closable
                    />
                  </Col>
                </div>
              ) }

              <div style={ { marginTop: 10 } }>
                { this.state.loading ? (
                  <Fragment>
                    <Loading />
                    <h2 className="has-text-centered">Cargando...</h2>
                  </Fragment>
                ) : (
                    <div className="container card-Sugeridos" >
                      <Row gutter={ [ 12, 24 ] }>
                        {/* Mapeo de datos en card, Se utiliza Row y Col de antd para agregar columnas */ }
                        { pageOfItems.map( ( users, userIndex ) => (
                          <Col key={ `user-item-${ userIndex }` } xs={ 24 } sm={ 24 } md={ 24 } lg={ 24 } xl={ 12 } xxl={ 12 }>
                            <Card
                              extra={
                                <a
                                 /* style={{ color: "white" }}
                                  onClick={() => {
                                    this.SendFriendship({
                                      eventUserIdReceiver: users._id,
                                      userName: users.properties.names || users.properties.email,
                                    });
                                  }}*/>
                                </a>
                              }
                              hoverable={ 8 }
                              headStyle={ ( users.destacado && users.destacado == true ) ? { backgroundColor: "#6ddab5" } : { backgroundColor: event.styles.toolbarDefaultBg } }
                              style={ { width: 500, marginTop: "2%", marginBottom: "2%", textAlign: "left" } }
                              bordered={ true }>
                              <Meta
                                avatar={
                                  <Avatar>
                                    { users.properties.names
                                      ? users.properties.names.charAt( 0 ).toUpperCase()
                                      : users.properties.names }
                                  </Avatar>
                                }
                                title={ users.properties.names ? users.properties.names : "No registra Nombre" }
                                description={ [
                                  <div>
                                    <br />
                                    <Row>
                                      <Col xs={ 24 }>
                                        <div>
                                          {
                                            asistantData.map( ( data, dataIndex ) => (
                                              !data.privatePublic && data.privatePublic !== undefined && users.properties[ data.name ] && (
                                                <div key={ `public-field-${ userIndex }-${ dataIndex }` }>
                                                  <p><b>{ data.label }:</b> { users.properties[ data.name ] }</p>
                                                </div>
                                              )
                                            ) )
                                          }
                                        </div>
                                      </Col>
                                      <Col xs={ 24 }>
                                        <Button
                                          style={ { backgroundColor: "#363636", color: "white" } }
                                          onClick={ () => {
                                            this.setState( { eventUserIdToMakeAppointment: users._id } )
                                          } }
                                        >
                                          { 'Agendar cita' }
                                        </Button>
                                        <Button
                                          style={ { backgroundColor: "#363636", color: "white" } }
                                          onClick={ () => {
                                            this.SendFriendship( {
                                              eventUserIdReceiver: users._id,
                                              userName: users.properties.names || users.properties.email,
                                            } );
                                          } }
                                        >
                                          { 'Enviar solicitud de Contacto' }
                                        </Button>
                                      </Col>
                                    </Row>
                                    <br />
                                  </div>,
                                ] }
                              />
                            </Card>
                          </Col>
                        ) ) }
                      </Row>

                      {/* Paginacion para mostrar datos de una manera mas ordenada */ }
                      <Pagination items={ users } change={ this.state.changeItem } onChangePage={ this.onChangePage } />
                    </div>
                  ) }
              </div>
            </TabPane>



            <TabPane tab="Mis Contactos" key="mis-contactos">
              <ContactList eventId={ this.props.event._id } />
            </TabPane>

            <TabPane tab="Solicitudes de Contacto" key="solicitudes">
              <RequestList eventId={ this.props.event._id } />
            </TabPane>

            <TabPane tab="Solicitudes de citas" key="solicitudes-de-citas">
              { activeTab === 'solicitudes-de-citas' && (
                <AppointmentRequests
                  eventId={ event._id }
                  currentEventUserId={ eventUserId }
                  eventUsers={ users }
                />
              ) }
            </TabPane>

            <TabPane tab="Mi agenda" key="mi-agenda">
              { activeTab === 'mi-agenda' && (
                <MyAgenda
                  event={ event }
                  eventUser={ eventUser }
                  currentEventUserId={ eventUserId }
                  eventUsers={ users }
                />
              ) }
            </TabPane>
          </Tabs>
        </EventContent>
      </React.Fragment>
    );
  }
}
