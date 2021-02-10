import React, { Component, Fragment } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import { Row, Button, Col, Card, Avatar, Alert, Tabs, message, notification, Form } from 'antd';

import { SmileOutlined } from '@ant-design/icons';
import AppointmentModal from './appointmentModal';
import MyAgenda from './myAgenda';
import AppointmentRequests from './appointmentRequests';
import SearchComponent from '../shared/searchTable';
import Pagination from '../shared/pagination';
import Loading from '../loaders/loading';
import EventContent from '../events/shared/content';
import FilterNetworking from './FilterNetworking';

import * as Cookie from 'js-cookie';
import { EventsApi, EventFieldsApi, UsersApi } from '../../helpers/request';
import { formatDataToString } from '../../helpers/utils';

import { userRequest } from './services';
import ContactList from './contactList';
import RequestList from './requestList';

const { Meta } = Card;
const { TabPane } = Tabs;

class ListEventUser extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userReq: [], //Almacena el request original
      usersFiltered: [],
      users: [], //contiene los usuarios filtrados
      pageOfItems: [],
      clearSearch: false,
      loading: true,
      changeItem: false,
      activeTab: 'asistentes',
      eventUserId: null,
      currentUserName: null,
      eventUserIdToMakeAppointment: '',
      asistantData: [],
      matches: [],
      filterSector: null,
      typeAssistant: null,
    };
  }

  async componentDidMount() {
    await this.getInfoCurrentUser();
    this.loadData();
  }

  changeActiveTab = (activeTab) => {
    this.setState({ activeTab });
  };

  closeAppointmentModal = () => {
    this.setState({ eventUserIdToMakeAppointment: '' });
  };

  loadData = async () => {
    let { changeItem } = this.state;
    const { event } = this.props;

    // NO BORRAR ES UN AVANCE  PARA OPTIMIZAR LAS PETICIONES A LA API DE LA SECCION NETWORKING
    // let eventUserList = []
    // const response = await UsersApi.getAll(event._id);

    // if(response.data){
    //   eventUserList = response.data.filter(user => user.account_id !== )
    // }

    //Servicio que trae la lista de asistentes excluyendo el usuario logeado
    let eventUserList = await userRequest.getEventUserList(
      event._id,
      Cookie.get('evius_token'),
      this.props.currentUser
    );

    /** Inicia destacados
     * Búscamos usuarios destacados para colocarlos de primeros en la lista(destacados), tiene varios usos cómo publicitarios
     * estos tienen una propiedad llamada destacados, en un futuro debemos poner esto cómo un rol de asistente para facilitar
     * la administración por el momento este valor se esta quemando directamente en la base de datos
     */
    let destacados = [];
    destacados = eventUserList.filter((asistente) => asistente.destacado && asistente.destacado == true);
    if (destacados && destacados.length >= 0) {
      eventUserList = [...destacados, ...eventUserList];
    }
    //Finaliza destacados

    /*** INICIO CONTACTOS SUGERIDOS ***/

    // Arreglo para almacenar los matches resultantes segun los campos que se indiquen para este fin
    let matches = [];

    //Búscamos usuarios sugeridos según el campo sector esto es para el proyecto FENALCO
    if (this.state.eventUser) {
      let meproperties = this.state.eventUser.properties;

      //Finanzas del clima
      if (event._id === '5f9708a2e4c9eb75713f8cc6') {
        let prospectos = eventUserList.filter((asistente) => asistente.properties.participacomo);
        prospectos.map((prospecto) => {
          if (prospecto.properties.participacomo == 'Financiador') {
            matches.push(prospecto);
          }
        });
      }
      // Rueda de negocio naranja videojuegos
      else if (event._id === '5f92d0cee5e2552f1b7c8ea2') {
        if (meproperties.tipodeparticipante === 'Oferente') {
          matches = eventUserList.filter((asistente) => asistente.properties.tipodeparticipante === 'Comprador');
        } else if (meproperties.tipodeparticipante === 'Comprador') {
          matches = eventUserList.filter((asistente) => asistente.properties.tipodeparticipante === 'Oferente');
        }
      }

      // Rueda de negocio naranja
      else if (event._id === '5f0622f01ce76d5550058c32') {
        let prospectos = eventUserList.filter((asistente) => asistente.properties.participacomo);
        prospectos.map((prospecto) => {
          if (
            prospecto.properties.queproductooserviciodeseacomprarpuedeseleccionarvariasopciones &&
            Array.isArray(prospecto.properties.queproductooserviciodeseacomprarpuedeseleccionarvariasopciones) &&
            prospecto.properties.queproductooserviciodeseacomprarpuedeseleccionarvariasopciones.length > 0
          ) {
            prospecto.properties.queproductooserviciodeseacomprarpuedeseleccionarvariasopciones.map((interes) => {
              const matchOk = interes.label.match(new RegExp(meproperties.queproductooservicioofreces, 'gi'));
              if (matchOk !== null) {
                matches.push(prospecto);
              }
            });
          }
        });
      }

      // Fenalco Meetups
      else if (event._id === '5f0622f01ce76d5550058c32') {
        matches = eventUserList.filter((asistente) => asistente.properties.tipodeparticipante === 'Comprador');
      }
    }

    let asistantData = await EventFieldsApi.getAll(event._id);

    this.setState((prevState) => {
      return {
        userReq: eventUserList, //request original
        usersFiltered: eventUserList,
        users: eventUserList,
        changeItem,
        loading: false,
        clearSearch: !prevState.clearSearch,
        asistantData,
        matches,
      };
    });
  };

  // Funcion que trae el eventUserId del usuario actual
  getInfoCurrentUser = async () => {
    const { event, currentUser } = this.props;

    if (currentUser) {
      const eventUser = await EventsApi.getcurrentUserEventUser(event._id);

      if (eventUser !== null) {
        this.setState({ eventUser, eventUserId: eventUser._id, currentUserName: eventUser.names || eventUser.email });
      }
    }
  };

  onChangePage = (pageOfItems) => {
    this.setState({ pageOfItems: pageOfItems });
  };

  //Se ejecuta cuando se selecciona el filtro
  handleSelectFilter = (value) => {
    let inputSearch = document.getElementById('inputSearch');
    let nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
    nativeInputValueSetter.call(inputSearch, value);
    let ev2 = new Event('input', { bubbles: true });
    inputSearch.dispatchEvent(ev2);
  };

  //Search records at third column
  searchResult = (data) => {
    !data ? this.setState({ users: [] }) : this.setState({ users: data });
  };

  async SendFriendship({ eventUserIdReceiver, userName }) {
    let { eventUserId, currentUserName } = this.state;
    let currentUser = Cookie.get('evius_token');

    message.loading('Enviando solicitud');
    if (currentUser) {
      // Se valida si el usuario esta suscrito al evento
      if (eventUserId) {
        // Se usan los EventUserId
        const data = {
          id_user_requested: eventUserId,
          id_user_requesting: eventUserIdReceiver,
          user_name_requested: currentUserName,
          user_name_requesting: userName,
          event_id: this.props.event._id,
          state: 'send',
        };

        // Se ejecuta el servicio del api de evius
        try {
          await EventsApi.sendInvitation(this.props.event._id, data);
          notification.open({
            message: 'Solicitud enviada',
            description:
              'Le llegará un correo a la persona notificandole la solicitud, quién la aceptara o recharaza. Una vez la haya aceptado te llegará un correo confirmando y podrás regresar a esta misma sección en mis contactos a ver la información completa del nuevo contacto.',
            icon: <SmileOutlined style={{ color: '#108ee9' }} />,
            duration: 30,
          });
        } catch (err) {
          let { data } = err.response;
          message.warning(data.message);
        }
      } else {
        message.warning('No es posible enviar solicitudes. No se encuentra suscrito al evento');
      }
    } else {
      message.warning('Para enviar la solicitud es necesario iniciar sesión');
    }
  }

  //Método que se ejecuta cuando se selecciona el tipo de usuario
  handleSelectTypeUser = async (typeUser) => {
    const { userReq } = this.state;
    if (typeUser === '') {
      this.setState({ usersFiltered: userReq });
      this.searchResult(userReq);
    } else {
      const listByTypeuser = await userReq.filter((item) => item.properties.participacomo === typeUser);
      this.setState({ usersFiltered: listByTypeuser });
      this.searchResult(listByTypeuser);
    }

    let inputSearch = document.getElementById('inputSearch');
    let nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
    nativeInputValueSetter.call(inputSearch, '');
    let ev1 = new Event('input', { bubbles: true });
    inputSearch.dispatchEvent(ev1);

    // let filterSector = document.getElementById('filterSector')
    // let nativeInputValueSetter2 = Object.getOwnPropertyDescriptor(window.HTMLSelectElement.prototype, "value").set;
    // nativeInputValueSetter2.call(filterSector, '');
    // let ev2 = new Event('select', { bubbles: true});
    // filterSector.dispatchEvent(ev2);
  };

  render() {
    const { event } = this.props;

    const {
      usersFiltered,
      users,
      pageOfItems,
      eventUserId,
      eventUser,
      asistantData,
      eventUserIdToMakeAppointment,
      activeTab,
      matches,
    } = this.state;

    return (
      <div style={{ width: '86.66667%' }}>
        <EventContent>
          {/* Componente de busqueda */}
          <Tabs activeKey={activeTab} onChange={this.changeActiveTab}>
            <TabPane tab='Sugeridos' key='sugeridos'>
              <AppointmentModal
                event={event}
                currentEventUserId={eventUserId}
                targetEventUserId={eventUserIdToMakeAppointment}
                closeModal={this.closeAppointmentModal}
              />
              <Col xs={22} sm={22} md={10} lg={10} xl={10} style={{ margin: '0 auto' }}>
                <h1> Encuentra aquí tus contactos sugeridos, basados en la información de registro al evento.</h1>
              </Col>
              <Col xs={22} sm={22} md={10} lg={10} xl={10} style={{ margin: '0 auto' }}>
                <Alert
                  message='Información Adicicional'
                  description='Solo puedes ver una cantidad de información pública limitada de cada asistente, para ver toda la información de otro asistente debes realizar una solicitud de contacto
                  se le informara al asistente quien aceptara o recharaza la solicitud, Una vez la haya aceptado te llegará un correo confirmando y podrás regresar a esta misma sección en mis contactos a ver la información completa del nuevo contacto.'
                  type='info'
                  closable
                />
              </Col>
              {!this.state.loading && !eventUserId && (
                <div>
                  <br />
                  <Col xs={22} sm={22} md={10} lg={10} xl={10} style={{ margin: '0 auto' }}>
                    <Alert
                      message='Solicitudes'
                      description='Para enviar solicitudes debes estar suscrito al evento'
                      type='info'
                      closable
                    />
                  </Col>
                </div>
              )}

              <div style={{ marginTop: 10 }}>
                {this.state.loading ? (
                  <Fragment>
                    <Loading />
                    <h2 className='has-text-centered'>Cargando...</h2>
                  </Fragment>
                ) : (
                  <div className='card-Networking'>
                    <div className='container' justify='center'>
                      <Row justify='space-between'>
                        {/* Mapeo de datos en card, Se utiliza Row y Col de antd para agregar columnas */}
                        {matches.map((users, userIndex) => (
                          <Col
                            key={`user-item-${userIndex}`}
                            xs={20}
                            sm={20}
                            md={20}
                            lg={20}
                            xl={18}
                            xxl={12}
                            offset={2}>
                            <Card
                              extra={
                                <a
                                  onClick={() => {
                                    this.SendFriendship({
                                      eventUserIdReceiver: users._id,
                                      userName: users.properties.names || users.properties.email,
                                    });
                                  }}></a>
                              }
                              hoverable={8}
                              headStyle={
                                users.destacado && users.destacado == true
                                  ? { backgroundColor: '#33FFEC' }
                                  : { backgroundColor: event.styles.toolbarDefaultBg }
                              }
                              style={{ width: 500, marginTop: '2%', marginBottom: '2%', textAlign: 'left' }}
                              bordered={true}>
                              <Meta
                                avatar={
                                  <Avatar>
                                    {users.properties.names
                                      ? users.properties.names.charAt(0).toUpperCase()
                                      : users.properties.names}
                                  </Avatar>
                                }
                                title={users.properties.names ? users.properties.names : 'No registra Nombre'}
                                description={[
                                  <div key={`ui-${userIndex}`}>
                                    <br />
                                    <Row>
                                      <Col xs={24}>
                                        <div>
                                          {asistantData.map(
                                            (data, dataIndex) =>
                                              /*Condicion !data.visible para poder tener en cuenta el campo visible en los datos que llegan, 
                                                  esto ya que visibleByContacst es variable nueva, ambas realizan la misma funcionalidad
                                                */
                                              !data.visibleByAdmin &&
                                              users.properties[data.name] && (
                                                <div key={`public-field-${userIndex}-${dataIndex}`}>
                                                  <p>
                                                    <b>{data.label}:</b>{' '}
                                                    {formatDataToString(users.properties[data.name], data)}
                                                  </p>
                                                </div>
                                              )
                                          )}
                                        </div>
                                      </Col>
                                      {eventUserId !== null && (
                                        <Col xs={24}>
                                          <Button
                                            type='primary'
                                            onClick={() => {
                                              this.setState({ eventUserIdToMakeAppointment: users._id });
                                            }}>
                                            {'Agendar cita'}
                                          </Button>
                                        </Col>
                                      )}
                                    </Row>
                                    <br />
                                  </div>,
                                ]}
                              />
                            </Card>
                          </Col>
                        ))}
                      </Row>
                    </div>
                  </div>
                )}
              </div>
            </TabPane>

            <TabPane tab='Todos los Asistentes' key='asistentes'>
              <AppointmentModal
                event={event}
                currentEventUserId={eventUserId}
                targetEventUserId={eventUserIdToMakeAppointment}
                closeModal={this.closeAppointmentModal}
              />
              <Form>
                <Row justify='space-around' gutter={[16, 16]}>
                  <Col xs={24} sm={24} md={24} lg={24} xl={24} style={{ margin: '0 auto' }}>
                    <Form.Item
                      labelCol={{ span: 24 }}
                      label='Busca aquí las personas que deseas contactar'
                      name='searchInput'>
                      <SearchComponent
                        id='searchInput'
                        placeholder={''}
                        data={usersFiltered}
                        kind={'user'}
                        event={this.props.event._id}
                        searchResult={this.searchResult}
                        clear={this.state.clearSearch}
                        styles={{ width: '300px' }}
                      />
                    </Form.Item>
                  </Col>
                </Row>

                <Row justify='space-around' gutter={[16, 16]}>
                  {/*Alerta quemado para el eventop de finanzas de clima*/}
                  {event._id === '5f9708a2e4c9eb75713f8cc6' && (
                    <>
                      <Alert
                        message='Sugerencias de Busqueda'
                        description='Te recomendamos buscar de acuerdo a las 
                          siguientes palabras claves: Adaptación, Mitigación, 
                          Energía, Agropecuario, Industria, Circular, TIC, Residuos, 
                          Turismo, Transporte, Forestal,  Vivienda, Start Up, Pyme, Entes territoriales, 
                          Gran empresa, Pública, Privada, Mixta, ONG'
                        type='info'
                        showIcon
                        closable
                      />
                      <Col xs={24} sm={24} md={10} lg={10} xl={10}>
                        <Form.Item label='Tipo de asistente' name='filterTypeUser' labelCol={{ span: 24 }}>
                          <FilterNetworking
                            id='filterSector'
                            properties={this.props.event.user_properties || []}
                            filterProperty={'participacomo'}
                            handleSelect={this.handleSelectFilter}
                          />
                        </Form.Item>
                      </Col>
                      <Col xs={24} sm={24} md={10} lg={10} xl={10}>
                        <Form.Item label='Sector' name='filterSector' labelCol={{ span: 24 }}>
                          <FilterNetworking
                            id='filterSector'
                            properties={this.props.event.user_properties || []}
                            filterProperty={'sector'}
                            handleSelect={this.handleSelectFilter}
                          />
                        </Form.Item>
                      </Col>
                    </>
                  )}

                  {/*Ruedas de negocio naranja videojuegos*/}
                  {event._id === '5f92d0cee5e2552f1b7c8ea2' && (
                    <>
                      <Col xs={24} sm={24} md={10} lg={10} xl={10}>
                        <Form.Item label='Tipo de asistente' name='filterTypeUser' labelCol={{ span: 24 }}>
                          <FilterNetworking
                            id='filterSector'
                            properties={this.props.event.user_properties || []}
                            filterProperty={'participascomo'}
                            handleSelect={this.handleSelectFilter}
                          />
                        </Form.Item>
                      </Col>
                      <Col xs={24} sm={24} md={10} lg={10} xl={10}>
                        <Form.Item label='Tipo de participante' name='filterSector' labelCol={{ span: 24 }}>
                          <FilterNetworking
                            id='filterSector'
                            properties={this.props.event.user_properties || []}
                            filterProperty={'tipodeparticipante'}
                            handleSelect={this.handleSelectFilter}
                          />
                        </Form.Item>
                      </Col>
                    </>
                  )}

                  {/*Ruedas de negocio naranja*/}
                  {event._id === '5f7f21217828e17d80642856' && (
                    <>
                      <Col xs={24} sm={24} md={10} lg={10} xl={10}>
                        <Form.Item label='Tipo de asistente' name='filterTypeUser' labelCol={{ span: 24 }}>
                          <FilterNetworking
                            id='filterSector'
                            properties={this.props.event.user_properties || []}
                            filterProperty={'participacomo'}
                            handleSelect={this.handleSelectFilter}
                          />
                        </Form.Item>
                      </Col>
                      <Col xs={24} sm={24} md={10} lg={10} xl={10}>
                        <Form.Item label='Sector' name='filterSector' labelCol={{ span: 24 }}>
                          <FilterNetworking
                            id='filterSector'
                            properties={this.props.event.user_properties || []}
                            filterProperty={'queproductooservicioofreces'}
                            handleSelect={this.handleSelectFilter}
                          />
                        </Form.Item>
                      </Col>
                    </>
                  )}

                  {/*Fenalco Meetups*/}
                  {event._id === '5f0622f01ce76d5550058c32' && (
                    <>
                      <Col xs={24} sm={24} md={10} lg={10} xl={10}>
                        <Form.Item label='Tipo de asistente' name='filterTypeUser' labelCol={{ span: 24 }}>
                          <FilterNetworking
                            id='filterSector'
                            properties={this.props.event.user_properties || []}
                            filterProperty={'asistecomo'}
                            handleSelect={this.handleSelectFilter}
                          />
                        </Form.Item>
                      </Col>
                      <Col xs={24} sm={24} md={10} lg={10} xl={10}>
                        <Form.Item label='Sector' name='filterSector' labelCol={{ span: 24 }}>
                          <FilterNetworking
                            id='filterSector'
                            properties={this.props.event.user_properties || []}
                            filterProperty={'sector'}
                            handleSelect={this.handleSelectFilter}
                          />
                        </Form.Item>
                      </Col>
                    </>
                  )}
                </Row>
              </Form>
              <Col xs={22} sm={22} md={10} lg={10} xl={10} style={{ margin: '0 auto' }}>
                <Alert
                  message='Información Adicicional'
                  description='Solo puedes ver una cantidad de información pública limitada de cada asistente, para ver toda la información de otro asistente debes realizar una solicitud de contacto
                  se le informara al asistente quien aceptara o recharaza la solicitud, Una vez la haya aceptado te llegará un correo confirmando y podrás regresar a esta misma sección en mis contactos a ver la información completa del nuevo contacto.'
                  type='info'
                  closable
                />
              </Col>
              {!this.state.loading && !eventUserId && (
                <div>
                  <br />
                  <Col xs={22} sm={22} md={10} lg={10} xl={10} style={{ margin: '0 auto' }}>
                    <Alert
                      message='Solicitudes'
                      description='Para enviar solicitudes debes estar suscrito al evento'
                      type='info'
                      closable
                    />
                  </Col>
                </div>
              )}

              <div style={{ marginTop: 10 }}>
                {this.state.loading ? (
                  <Fragment>
                    <Loading />
                    <h2 className='has-text-centered'>Cargando...</h2>
                  </Fragment>
                ) : (
                  <div className='container card-Sugeridos'>
                    <Row justify='space-between'>
                      {/* Mapeo de datos en card, Se utiliza Row y Col de antd para agregar columnas */}
                      {pageOfItems.map((users, userIndex) => (
                        <Col key={`user-item-${userIndex}`} xs={20} sm={20} md={20} lg={10} xl={10} xxl={10} offset={2}>
                          <Card
                            extra={
                              <a
                              /* style={{ color: "white" }}
                                  onClick={() => {
                                    this.SendFriendship({
                                      eventUserIdReceiver: users._id,
                                      userName: users.properties.names || users.properties.email,
                                    });
                                  }}*/
                              ></a>
                            }
                            hoverable={8}
                            headStyle={
                              users.destacado && users.destacado == true
                                ? { backgroundColor: '#6ddab5' }
                                : { backgroundColor: event.styles.toolbarDefaultBg }
                            }
                            style={{ width: '100%', marginTop: '2%', marginBottom: '2%', textAlign: 'left' }}
                            bordered={true}>
                            <Meta
                              avatar={
                                <Avatar>
                                  {users.properties.names
                                    ? users.properties.names.charAt(0).toUpperCase()
                                    : users.properties.names}
                                </Avatar>
                              }
                              title={users.properties.names ? users.properties.names : 'No registra Nombre'}
                              description={[
                                <div key={`ug-${userIndex}`}>
                                  <br />
                                  <Row>
                                    <Col xs={24}>
                                      <div>
                                        {/* {!data.visible || !data.visibleByContacts && */
                                        asistantData.map(
                                          (property, propertyIndex) =>
                                            !property.visibleByAdmin &&
                                            !property.visibleByContacts &&
                                            users.properties[property.name] && (
                                              <div key={`public-field-${userIndex}-${propertyIndex}`}>
                                                <p>
                                                  <b>{`${property.label}: `}</b>
                                                  {formatDataToString(users.properties[property.name], property)}
                                                </p>
                                              </div>
                                            )
                                        )}
                                      </div>
                                    </Col>
                                    {eventUserId !== null && (
                                      <Col xs={24}>
                                        <Button
                                          style={{ backgroundColor: '#363636', color: 'white' }}
                                          onClick={() => {
                                            this.setState({ eventUserIdToMakeAppointment: users._id });
                                          }}>
                                          {'Agendar cita'}
                                        </Button>
                                        <Button
                                          style={{ backgroundColor: '#363636', color: 'white' }}
                                          onClick={() => {
                                            this.SendFriendship({
                                              eventUserIdReceiver: users._id,
                                              userName: users.properties.names || users.properties.email,
                                            });
                                          }}>
                                          {'Enviar solicitud de Contacto'}
                                        </Button>
                                      </Col>
                                    )}
                                  </Row>
                                  <br />
                                </div>,
                              ]}
                            />
                          </Card>
                        </Col>
                      ))}
                    </Row>

                    {/* Paginacion para mostrar datos de una manera mas ordenada */}
                    <Pagination items={users} change={this.state.changeItem} onChangePage={this.onChangePage} />
                  </div>
                )}
              </div>
            </TabPane>

            <TabPane tab='Mis Contactos' key='mis-contactos'>
              <ContactList eventId={this.props.event._id} section={this.props.section} />
            </TabPane>

            <TabPane tab='Solicitudes de Contacto' key='solicitudes'>
              <RequestList eventId={this.props.event._id} />
            </TabPane>

            <TabPane tab='Solicitudes de citas' key='solicitudes-de-citas'>
              {activeTab === 'solicitudes-de-citas' && (
                <AppointmentRequests eventId={event._id} currentEventUserId={eventUserId} eventUsers={users} />
              )}
            </TabPane>

            <TabPane tab='Mi agenda' key='mi-agenda'>
              {activeTab === 'mi-agenda' && (
                <MyAgenda event={event} eventUser={eventUser} currentEventUserId={eventUserId} eventUsers={users} />
              )}
            </TabPane>
          </Tabs>
        </EventContent>
      </div>
    );
  }
}
export default ListEventUser;
