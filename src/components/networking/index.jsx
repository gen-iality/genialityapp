import React, { Component, Fragment } from "react";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Row, Button, Col, Card, Avatar, Alert, Tabs, message } from "antd";

import AppointmentModal from "./appointmentModal";
import SearchComponent from "../shared/searchTable";
import Pagination from "../shared/pagination";
import Loading from "../loaders/loading";
import EventContent from "../events/shared/content";

import * as Cookie from "js-cookie";
import API, { EventsApi, RolAttApi, EventFieldsApi } from "../../helpers/request";
import { firestore } from "../../helpers/firebase";
import { getCurrentUser, getCurrentEventUser, userRequest } from "./services";

import ContactList from "./contactList";
import RequestList from "./requestList";

const { Meta } = Card;
const { TabPane } = Tabs;

export default class ListEventUser extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userReq: [],
      users: [],
      pageOfItems: [],
      clearSearch: false,
      loading: true,
      changeItem: false,
      eventUserId: null,
      currentUserName: null,
      userIdToMakeAppointment: '',
      asistantData: []
    };
  }

  componentDidMount() {
    this.getInfoCurrentUser();
    this.loadData();
  }

  closeAppointmentModal = () => {
    this.setState({ userIdToMakeAppointment: '' })
  }

  loadData = async () => {
    let { changeItem } = this.state;
    const { event } = this.props;

    // Servicio que trae la lista de asistentes excluyendo el usuario logeado
    let eventUserList = await userRequest.getEventUserList(event._id, Cookie.get("evius_token"));
    let asistantData = await EventFieldsApi.getAll(event._id)
    // console.log("eventUserList:", eventUserList);
    this.setState((prevState) => {
      return {
        userReq: eventUserList,
        users: eventUserList,
        changeItem,
        loading: false,
        clearSearch: !prevState.clearSearch,
        asistantData
      };
    });
  };

  // Funcion que trae el eventUserId del usuario actual
  getInfoCurrentUser = () => {
    const { event } = this.props;
    let currentUser = Cookie.get("evius_token");

    if (currentUser) {
      getCurrentUser(currentUser).then(async (user) => {
        const eventUser = await getCurrentEventUser(event._id, user._id);

        this.setState({ eventUserId: eventUser._id, currentUserName: eventUser.names || eventUser.email });
      });
    }
  };

  onChangePage = (pageOfItems) => {
    this.setState({ pageOfItems: pageOfItems });
  };

  //Search records at third column
  searchResult = (data) => {
    !data ? this.setState({ users: [] }) : this.setState({ users: data });
  };

  async SendFriendship({ eventUserIdReceiver, userName }) {
    let { eventUserId, currentUserName } = this.state;
    let currentUser = Cookie.get("evius_token");

    message.loading("Enviando solicitud");
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
          state: "send",
        };

        // console.log("data:", data);

        // Se ejecuta el servicio del api de evius
        try {
          const response = await EventsApi.sendInvitation(this.props.event._id, data);
          console.log("Esta es la respuesta:", response);
          message.success("Solicitud enviada");
        } catch (err) {
          let { data } = err.response;
          message.warning(data.message);
        }
      } else {
        message.warning("No es posible enviar solicitudes. No se encuentra suscrito al evento");
      }
    } else {
      message.warning("Para enviar la solicitud es necesario iniciar sesiÃ³n");
    }
  }

  render() {
    const { event } = this.props;
    const { userReq, users, pageOfItems, eventUserId, asistantData, userIdToMakeAppointment } = this.state;

    return (
      <React.Fragment>
        <EventContent>
          {/* Componente de busqueda */}
          <Tabs>
            <TabPane tab="Asistentes" key="1">
              <AppointmentModal
                event={event}
                userId={userIdToMakeAppointment}
                closeModal={this.closeAppointmentModal}
              />
              <Col xs={22} sm={22} md={10} lg={10} xl={10} style={{ margin: "0 auto" }}>
                <h1> Busca aquí el usuario.</h1>

                <SearchComponent
                  placeholder={""}
                  data={userReq}
                  kind={"user"}
                  event={this.props.event._id}
                  searchResult={this.searchResult}
                  clear={this.state.clearSearch}
                />
              </Col>
              <Col xs={22} sm={22} md={10} lg={10} xl={10} style={{ margin: "0 auto" }}>
                <Alert
                  message="Información Adicicional"
                  description="La informacion de cada usuario es privada. Para poder verla es necesario enviar una solicitud como amigo"
                  type="info"
                  closable
                />
              </Col>
              {!this.state.loading && !eventUserId && (
                <div>
                  <br />
                  <Col xs={22} sm={22} md={10} lg={10} xl={10} style={{ margin: "0 auto" }}>
                    <Alert
                      message="Solicitudes"
                      description="Para enviar solicitudes desbes estar suscrito al evento"
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
                    <div>
                      <div>
                        {/* Mapeo de datos en card, Se utiliza Row y Col de antd para agregar columnas */}
                        {pageOfItems.map((users, userIndex) => (
                          <Row key={`user-item-${userIndex}`} justify="center">
                            <Card
                              extra={
                                <a
                                  onClick={() => {
                                    this.SendFriendship({
                                      eventUserIdReceiver: users._id,
                                      userName: users.properties.names || users.properties.email,
                                    });
                                  }}>
                                  Enviar Solicitud
                              </a>
                              }
                              style={{ width: 500, marginTop: "2%", marginBottom: "2%", textAlign: "left" }}
                              bordered={true}>
                              <Meta
                                avatar={
                                  <Avatar>
                                    {console.log(users.properties)}
                                    {users.properties.names
                                      ? users.properties.names.charAt(0).toUpperCase()
                                      : users.properties.names}
                                  </Avatar>
                                }
                                title={users.properties.names ? users.properties.names : "No registra Nombre"}
                                description={[
                                  <div>
                                    <br />
                                    <Row>
                                      <Col xs={24}>
                                        <p>
                                          Correo: {users.properties.email ? users.properties.email : "No registra Correo"}
                                        </p>
                                        <div>
                                          {
                                            asistantData.map((data, dataIndex) => (
                                              !data.privatePublic && data.privatePublic !== undefined && (
                                                <div key={`public-field-${userIndex}-${dataIndex}`}>
                                                  <p>{data.label}: {users.properties[data.name]}</p>
                                                </div>
                                              )
                                            ))
                                          }
                                        </div>
                                      </Col>
                                      <Col xs={24}>
                                        <Button
                                          onClick={() => {
                                            this.setState({ userIdToMakeAppointment: users._id })
                                          }}
                                        >
                                          {'Agendar cita'}
                                        </Button>
                                      </Col>
                                    </Row>
                                    <br />
                                  </div>,
                                ]}
                              />
                            </Card>
                          </Row>
                        ))}
                      </div>

                      {/* Paginacion para mostrar datos de una manera mas ordenada */}
                      <Pagination items={users} change={this.state.changeItem} onChangePage={this.onChangePage} />
                    </div>
                  )}
              </div>
            </TabPane>
            <TabPane tab="Mis Contactos" key="2">
              <ContactList eventId={this.props.event._id} />
            </TabPane>

            <TabPane tab="Solicitudes" key="3">
              <RequestList eventId={this.props.event._id} />
            </TabPane>
          </Tabs>
        </EventContent>
      </React.Fragment>
    );
  }
}
