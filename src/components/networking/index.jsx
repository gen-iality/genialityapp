import { Component, Fragment } from 'react' /* 
import 'react-toastify/dist/ReactToastify.css'; */
import {
  Row,
  Button,
  Col,
  Card,
  Avatar,
  Alert,
  Tabs,
  Form,
  Badge,
  notification,
  Modal,
  Result,
  Space,
  Spin,
} from 'antd'
import AppointmentModal from './appointmentModal'
import MyAgenda from './myAgenda'
import AppointmentRequests from './appointmentRequests'
import SearchComponent from '../shared/searchTable'
import Pagination from '../shared/pagination'
import Loading from '../loaders/loading'
import FilterNetworking from './FilterNetworking'
import { EventFieldsApi } from '@helpers/request'
import { formatDataToString } from '@helpers/utils'
import { userRequest } from './services'
import ContactList from './contactList'
import RequestList from './requestList'
import withContext from '@context/withContext'
import {
  addNotification,
  haveRequest,
  isMyContacts,
  SendFriendship,
} from '@helpers/netWorkingFunctions'
const { Meta } = Card
const { TabPane } = Tabs
import { setVirtualConference } from '../../redux/virtualconference/actions'
import { connect } from 'react-redux'
import { GetTokenUserFirebase } from '@helpers/HelperAuth'

class ListEventUser extends Component {
  constructor(props) {
    super(props)
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
      eventUserIdToMakeAppointment: null,
      eventUserToMakeAppointment: null,
      asistantData: [],
      matches: [],
      filterSector: null,
      typeAssistant: null,
      requestListSent: [],
      modalView: false,
      listTotalUser: [],
      updatetable: false,
    }
  }

  async componentDidMount() {
    await this.getInfoCurrentUser()
    this.loadData()
    await this.props.cHelper.obtenerContactos()
    this.props.setVirtualConference(false)
  }

  changeActiveTab = async (activeTab) => {
    this.setState({ activeTab })
    if (activeTab == 'asistentes') {
      this.setState({ loading: true })
      await this.loadData()
      await this.props.cHelper.obtenerContactos()
    }
  }
  closeAppointmentModal = () => {
    this.setState({
      eventUserIdToMakeAppointment: null,
      eventUserToMakeAppointment: null,
    })
  }
  agendarCita = (iduser, user) => {
    this.setState({
      eventUserIdToMakeAppointment: iduser,
      eventUserToMakeAppointment: user,
    })
  }
  loadData = async () => {
    const { changeItem } = this.state
    const showModal = window.sessionStorage.getItem('message') === null
    this.setState({ modalView: showModal })
    // No borrar es un avance  para optimizar las peticiones a la api de la seccion networking
    let eventUserList = []
    // const response = await UsersApi.getAll(event._id);
    // if(response.data){
    //   eventUserList = response.data.filter(user => user.account_id !== )
    // }

    //Servicio que trae la lista de asistentes excluyendo el usuario logeado
    const evius_token = await GetTokenUserFirebase()
    eventUserList = await userRequest.getEventUserList(
      this.props.cEvent.value._id,
      evius_token,
      this.state.eventUser,
    )

    /** Inicia destacados
     * Búscamos usuarios destacados para colocarlos de primeros en la lista(destacados), tiene varios usos cómo publicitarios
     * estos tienen una propiedad llamada destacados, en un futuro debemos poner esto cómo un rol de asistente para facilitar
     * la administración por el momento este valor se esta quemando directamente en la base de datos
     */

    if (eventUserList && eventUserList.length > 0) {
      let destacados = []
      destacados = eventUserList.filter(
        (asistente) => asistente.destacado && asistente.destacado,
      )
      if (destacados && destacados.length >= 0) {
        eventUserList = [...destacados, ...eventUserList]
      }
      //Finaliza destacados

      /*** INICIO CONTACTOS SUGERIDOS ***/

      const asistantData = await EventFieldsApi.getAll(this.props.cEvent.value._id)

      this.setState((prevState) => {
        return {
          listTotalUser: eventUserList,
          userReq: eventUserList, //request original
          usersFiltered: eventUserList,
          users: eventUserList,
          pageOfItems: eventUserList,
          changeItem,
          loading: false,
          clearSearch: !prevState.clearSearch,
          asistantData,
          matches: [],
        }
      })
    } else {
      this.setState({
        loading: false,
      })
    }
  }

  // Funcion que trae el eventUserId del usuario actual
  getInfoCurrentUser = async () => {
    const eventUser = this.props.cEventUser.value
    if (eventUser) {
      if (eventUser !== null) {
        this.setState({
          eventUser,
          eventUserId: eventUser._id,
          currentUserName: eventUser.names || eventUser.email,
        })
      }
    }
  }

  closeModal = () => {
    window.sessionStorage.setItem('message', true)
    this.setState({ modalView: false })
  }

  onChangePage = (pageOfItems) => {
    this.setState({ pageOfItems: pageOfItems })
  }

  //Se ejecuta cuando se selecciona el filtro
  handleSelectFilter = (value) => {
    const inputSearch = document.getElementById('inputSearch')
    const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
      window.HTMLInputElement.prototype,
      'value',
    ).set
    nativeInputValueSetter.call(inputSearch, value)
    const ev2 = new Event('input', { bubbles: true })
    inputSearch.dispatchEvent(ev2)
  }

  //Search records at third column
  searchResult = (data, search = 0) => {
    !data
      ? this.setState({ users: [] })
      : this.setState({ pageOfItems: data, users: data })
  }

  //Método que se ejecuta cuando se selecciona el tipo de usuario
  handleSelectTypeUser = async (typeUser) => {
    const { userReq } = this.state
    if (typeUser === '') {
      this.setState({ usersFiltered: userReq })
      this.searchResult(userReq)
    } else {
      const listByTypeuser = await userReq.filter(
        (item) => item.properties.participacomo === typeUser,
      )
      this.setState({ usersFiltered: listByTypeuser })
      this.searchResult(listByTypeuser)
    }

    const inputSearch = document.getElementById('inputSearch')
    const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
      window.HTMLInputElement.prototype,
      'value',
    ).set
    nativeInputValueSetter.call(inputSearch, '')
    const ev1 = new Event('input', { bubbles: true })
    inputSearch.dispatchEvent(ev1)

    // let filterSector = document.getElementById('filterSector')
    // let nativeInputValueSetter2 = Object.getOwnPropertyDescriptor(window.HTMLSelectElement.prototype, "value").set;
    // nativeInputValueSetter2.call(filterSector, '');
    // let ev2 = new Event('select', { bubbles: true});
    // filterSector.dispatchEvent(ev2);
  }

  haveRequestUser(user) {
    return haveRequest(user, this.props.cHelper.requestSend)
  }

  isMyContact(user) {
    const formatUSer = { ...user, eventUserId: user._id }
    const isContact = isMyContacts(formatUSer, this.props.cHelper.contacts)
    return isContact
  }
  componentWillUnmount() {
    this.props.setVirtualConference(true)
  }

  render() {
    const { event } = this.props

    const {
      usersFiltered,
      users,
      pageOfItems,
      eventUserId,
      eventUser,
      asistantData,
      eventUserIdToMakeAppointment,
      eventUserToMakeAppointment,
      activeTab,
      matches,
    } = this.state

    return (
      <Card style={{ padding: '5px' }}>
        <Modal visible={this.state.modalView} footer={null} closable={false}>
          <Result
            extra={
              <Button type="primary" onClick={this.closeModal}>
                Cerrar
              </Button>
            }
            title="Información adicional"
            subTitle="Solo puedes ver una cantidad de información pública limitada de cada asistente, para ver toda la información de otro asistente debes realizar una solicitud de contacto
                  se le informara al asistente quien aceptara o recharaza la solicitud, Una vez la haya aceptado te llegará un correo confirmando y podrás regresar a esta misma sección en mis contactos a ver la información completa del nuevo contacto."
          />
        </Modal>

        {/* Componente de busqueda */}
        <Tabs
          style={{ background: '#FFFFFF' }}
          activeKey={activeTab}
          onChange={this.changeActiveTab}>
          <TabPane tab="Participantes" key="asistentes">
            {
              <AppointmentModal
                targetEventUserId={this.state.eventUserIdToMakeAppointment}
                targetEventUser={this.state.eventUserToMakeAppointment}
                closeModal={this.closeAppointmentModal}
                cEvent={this.props.cEvent}
                cEventUser={this.props.cEventUser}
              />
            }

            <Form>
              <Row justify="space-around" gutter={[16, 16]}>
                <Col xs={24} sm={24} md={24} lg={24} xl={24} style={{ margin: '0 auto' }}>
                  <Form.Item
                    labelCol={{ span: 24 }}
                    label="Busca aquí las personas que deseas contactar"
                    name="searchInput">
                    <SearchComponent
                      id="searchInput"
                      placeholder=""
                      data={usersFiltered}
                      kind="user"
                      event={this.props.cEvent.value._id}
                      searchResult={this.searchResult}
                      users={this.state.users}
                      clear={this.state.clearSearch}
                      styles={{ width: '300px' }}
                    />
                  </Form.Item>
                </Col>
              </Row>
            </Form>
            <Col
              xs={22}
              sm={22}
              md={10}
              lg={10}
              xl={10}
              style={{ margin: '0 auto' }}></Col>
            {!this.state.loading && !eventUserId && (
              <div>
                <br />
                <Col xs={22} sm={22} md={10} lg={10} xl={10} style={{ margin: '0 auto' }}>
                  <Alert
                    message="Solicitudes"
                    description="Para enviar solicitudes debes estar suscrito al curso"
                    type="info"
                    closable
                  />
                </Col>
              </div>
            )}

            <div style={{ marginTop: 10 }}>
              {this.state.loading ? (
                <Fragment>
                  <Loading />
                  <h2 className="has-text-centered">Cargando...</h2>
                </Fragment>
              ) : (
                <div className="container card-Sugeridos">
                  <Row justify="space-between" gutter={[10, 10]}>
                    {/* Mapeo de datos en card, Se utiliza Row y Col de antd para agregar columnas */}
                    {pageOfItems.map((users, userIndex) => (
                      <Col
                        id={`user-item-${userIndex}`}
                        key={`user-item-${userIndex}`}
                        xs={24}
                        sm={24}
                        md={24}
                        lg={12}
                        xl={12}
                        xxl={8}>
                        <Card
                          hoverable={8}
                          headStyle={
                            users.destacado && users.destacado
                              ? { backgroundColor: '#6ddab5' }
                              : {
                                  backgroundColor:
                                    this.props.cEvent.value.styles.toolbarDefaultBg,
                                }
                          }
                          style={{
                            width: '100%',
                            marginTop: '2%',
                            marginBottom: '2%',
                            textAlign: 'left',
                          }}
                          bordered>
                          <Meta
                            avatar={
                              <Avatar
                                size={65}
                                src={users?.user?.picture ? users?.user?.picture : ''}>
                                {!users?.user?.picture && users.properties.names
                                  ? users.properties.names.charAt(0).toUpperCase()
                                  : users.properties.names}
                              </Avatar>
                            }
                            title={
                              users.properties.names
                                ? users.properties.names
                                : 'No registra Nombre'
                            }
                            description={[
                              <div key={`ug-${userIndex}`}>
                                <br />
                                <Row>
                                  <Col xs={24}>
                                    <div>
                                      {asistantData.map(
                                        (property, propertyIndex) =>
                                          (property.visibleByContacts == false ||
                                            property?.visibleByContacts == undefined ||
                                            property.visibleByContacts == 'public') &&
                                          (property?.sensibility == false ||
                                            property?.sensibility == undefined) &&
                                          users.properties[property.name] &&
                                          property.name !== 'picture' &&
                                          property.name !== 'imagendeperfil' &&
                                          property.type !== 'avatar' && (
                                            <div
                                              key={`public-field-${userIndex}-${propertyIndex}`}>
                                              <p>
                                                <b>{`${property.label}: `}</b>
                                                {formatDataToString(
                                                  property.type !== 'codearea'
                                                    ? users.properties[property.name]
                                                    : '(+' +
                                                        users.properties['code'] +
                                                        ')' +
                                                        users.properties[property.name],
                                                  property,
                                                )}
                                              </p>
                                            </div>
                                          ),
                                      )}
                                    </div>
                                  </Col>
                                  {eventUserId !== null && (
                                    <Space wrap>
                                      <Button
                                        type="primary"
                                        onClick={() => {
                                          //alert("ACAAA")

                                          this.setState({
                                            eventUserIdToMakeAppointment: users._id,
                                            eventUserToMakeAppointment: users,
                                          })
                                        }}>
                                        Agendar cita
                                      </Button>
                                      <Button
                                        type="primary"
                                        disabled={
                                          this.isMyContact(users) ||
                                          this.haveRequestUser(users) ||
                                          (users.send && users.send == 1) ||
                                          users.loading
                                        }
                                        onClick={
                                          !this.isMyContact(users)
                                            ? async () => {
                                                this.state.users[userIndex] = {
                                                  ...this.state.users[userIndex],
                                                  loading: true,
                                                }
                                                this.setState({ users: this.state.users })
                                                const sendResp = await SendFriendship(
                                                  {
                                                    eventUserIdReceiver: users._id,
                                                    userName:
                                                      users.properties.names ||
                                                      users.properties.email,
                                                  },
                                                  this.props.cEventUser.value,
                                                  this.props.cEvent.value,
                                                )

                                                const us = users

                                                if (sendResp._id) {
                                                  const notificationR = {
                                                    idReceive: us.account_id,
                                                    idEmited: sendResp._id,
                                                    emailEmited:
                                                      this.props.cEventUser.value.email ||
                                                      this.props.cEventUser.value.user
                                                        .email,
                                                    message:
                                                      (this.props.cEventUser.value
                                                        .names ||
                                                        this.props.cEventUser.value.user
                                                          .names) +
                                                      ' te ha enviado solicitud de amistad',
                                                    name: 'notification.name',
                                                    type: 'amistad',
                                                    state: '0',
                                                  }

                                                  addNotification(
                                                    notificationR,
                                                    this.props.cEvent.value,
                                                    this.props.cEventUser.value,
                                                  )
                                                  notification['success']({
                                                    message: 'Correcto!',
                                                    description:
                                                      'Se ha enviado la solicitud de amistad correctamente',
                                                  })

                                                  for (
                                                    let i = 0;
                                                    i < this.state.users.length;
                                                    i++
                                                  ) {
                                                    if (
                                                      this.state.users[i]._id == users._id
                                                    ) {
                                                      this.state.users[i] = {
                                                        ...this.state.users[i],
                                                        send: 1,
                                                        loading: false,
                                                      }
                                                      //  console.log("USER_CHANGE==>",this.state.users[i])
                                                    } else {
                                                      this.state.users[i] = {
                                                        ...this.state.users[i],
                                                        loading: false,
                                                      }
                                                    }
                                                  }
                                                  this.setState(
                                                    { users: this.state.users },
                                                    () => {
                                                      this.setState({
                                                        updatetable:
                                                          !this.state.updatetable,
                                                      })
                                                    },
                                                  )
                                                }
                                              }
                                            : null
                                        }>
                                        {!users.loading ? (
                                          this.isMyContact(users) ? (
                                            'Ya es tu contacto'
                                          ) : this.haveRequestUser(users) ||
                                            (users.send && users.send == 1) ? (
                                            'Confrimación pendiente'
                                          ) : (
                                            'Enviar solicitud de contacto'
                                          )
                                        ) : (
                                          <Spin />
                                        )}
                                      </Button>
                                    </Space>
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
                  {!this.state.loading &&
                    users.length > 0 &&
                    pageOfItems.length > 0 &&
                    this.props.cEventUser.value && (
                      <Pagination
                        updatetable={this.state.updatetable}
                        items={users}
                        change={this.state.changeItem}
                        onChangePage={this.onChangePage}
                      />
                    )}
                  {!this.state.loading &&
                    users.length == 0 &&
                    this.props.cEventUser.value && (
                      <Col
                        xs={24}
                        sm={22}
                        md={18}
                        lg={18}
                        xl={18}
                        style={{ margin: '0 auto' }}>
                        <Card style={{ textAlign: 'center' }}>No existen usuarios</Card>
                      </Col>
                    )}

                  {!this.state.loading && !this.props.cEventUser.value && (
                    <Alert
                      message="Iniciar sesión"
                      description="Para poder ver los asistentes es necesario iniciar sesión."
                      type="info"
                      showIcon
                    />
                  )}
                </div>
              )}
            </div>
          </TabPane>

          <TabPane
            tab={
              <div style={{ position: 'relative' }}>
                Mi agenda
                {this.props.cHelper.totalsolicitudAgenda > 0 && (
                  <Badge
                    style={{
                      position: 'absolute',
                      top: '-21px',
                      right: '-13px',
                    }}
                    count={
                      this.props.cHelper.totalsolicitudAgenda > 0 &&
                      this.props.cHelper.totalsolicitudAgenda
                    }></Badge>
                )}
              </div>
            }
            key="mi-agenda">
            {activeTab === 'mi-agenda' && (
              <>
                {this.props.cEventUser && this.props.cEventUser.value && (
                  <AppointmentRequests
                    eventId={this.props.cEvent.value._id}
                    currentEventUserId={eventUserId}
                    currentUser={this.props.currentUser}
                    notificacion={this.props.notification}
                    eventUsers={users}
                    showpendingsend={false}
                  />
                )}
                {this.props.cEventUser && this.props.cEventUser.value && (
                  <MyAgenda
                    event={this.props.cEvent.value}
                    eventUser={this.props.cEventUser.value}
                    currentEventUserId={this.props.cEventUser.value._id}
                    eventUsers={users}
                  />
                )}
              </>
            )}
          </TabPane>

          <TabPane tab="Mis contactos" key="mis-contactos">
            <ContactList
              agendarCita={this.agendarCita}
              eventId={this.props.cEvent.value._id}
              tabActive={this.state.activeTab}
            />
          </TabPane>

          <TabPane
            tab={
              <div style={{ position: 'relative' }}>
                Solicitudes de contacto
                {this.props.cHelper.totalSolicitudAmistad !== '0' && (
                  <Badge
                    style={{
                      position: 'absolute',
                      top: '-21px',
                      right: '-13px',
                    }}
                    count={
                      this.props.cHelper.totalSolicitudAmistad > 0
                        ? this.props.cHelper.totalSolicitudAmistad
                        : ''
                    }></Badge>
                )}
              </div>
            }
            key="solicitudes">
            <RequestList
              currentUser={this.props.cEventUser.value}
              currentUserAc={this.props.cUser.value}
              event={this.props.cEvent.value}
              //notification={this.props.notification}
              eventId={this.props.cEvent.value._id}
              tabActive={this.state.activeTab}
            />
          </TabPane>

          <TabPane
            tab={
              <div style={{ position: 'relative' }}>
                Solicitudes de citas
                {this.props.cHelper.totalsolicitudAgenda > 0 && (
                  <Badge
                    style={{
                      position: 'absolute',
                      top: '-21px',
                      right: '-13px',
                    }}
                    count={
                      this.props.cHelper.totalsolicitudAgenda > 0 &&
                      this.props.cHelper.totalsolicitudAgenda
                    }></Badge>
                )}
              </div>
            }
            key="solicitudes-de-citas">
            {activeTab === 'solicitudes-de-citas' && (
              <AppointmentRequests
                eventId={this.props.cEvent.value._id}
                currentEventUserId={eventUserId}
                currentUser={this.props.currentUser}
                notificacion={this.props.notification}
                eventUsers={users}
              />
            )}
          </TabPane>
        </Tabs>
      </Card>
    )
  }
}
const mapDispatchToProps = {
  setVirtualConference,
}

const ListEventUserWithContext = connect(
  null,
  mapDispatchToProps,
)(withContext(ListEventUser))
export default ListEventUserWithContext
