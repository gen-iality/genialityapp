import React, { Component, Fragment } from "react";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Row, Col, Table, Card, Avatar, Alert, Tabs } from "antd";

import SearchComponent from "../shared/searchTable";
import Pagination from "../shared/pagination";
import Loading from "../loaders/loading";
import EventContent from "../events/shared/content";

import * as Cookie from "js-cookie";
import API, { EventsApi, RolAttApi } from "../../helpers/request";
import { firestore } from "../../helpers/firebase";
import { getCurrentUserId, getCurrentEventUser, networkingFire, userRequest } from "./services";

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
    };
  }

  componentDidMount() {
    this.loadData();
    this.getInfoCurrentUser();
  }

  loadData = async () => {
    let { changeItem } = this.state;
    const { event } = this.props;

    let eventUserList = await userRequest.getEventUserList(event._id, Cookie.get("evius_token"));
    console.log(eventUserList);
    this.setState((prevState) => {
      return {
        userReq: eventUserList,
        users: eventUserList.slice(0, 100),
        changeItem,
        loading: false,
        clearSearch: !prevState.clearSearch,
      };
    });
  };

  getInfoCurrentUser = () => {
    const { event } = this.props;
    let currentUser = Cookie.get("evius_token");

    if (currentUser) {
      getCurrentUserId(currentUser).then(async (userId) => {
        let response = await getCurrentEventUser(event._id, userId);
        console.log("eventUserId:", response);
        this.setState({ eventUserId: response._id });
      });
    }
  };

  sendRequestInFire = (data) => {
    const { event } = this.props;
    networkingFire.sendRequestToUser(event._id, data);
  };

  onChangePage = (pageOfItems) => {
    this.setState({ pageOfItems: pageOfItems });
  };

  //Search records at third column
  searchResult = (data) => {
    !data ? this.setState({ users: [] }) : this.setState({ users: data });
  };

  async SendFriendship(id) {
    let { eventUserId } = this.state;
    let currentUser = Cookie.get("evius_token");
    if (currentUser) {
      const data = {
        id_user_requested: eventUserId,
        id_user_requesting: id,
        event_id: this.props.event._id,
        state: "send",
      };

      this.sendRequestInFire(data);

      const response = await EventsApi.sendInvitation(this.props.event._id, data);
      console.log(response);
    } else {
      toast.warn("Para enviar la solicitud es necesario iniciar sesión");
    }
  }

  render() {
    const { userReq, users, pageOfItems } = this.state;
    return (
      <React.Fragment>
        <EventContent>
          {/* Componente de busqueda */}
          <Tabs>
            <TabPane tab="Asistentes" key="1">
              <Col xs={22} sm={22} md={10} lg={10} xl={10} style={{ margin: "0 auto" }}>
                <p>
                  <h1> Busca aquí el usuarios.</h1>
                </p>

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
                      {pageOfItems.map((users, key) => (
                        <Row key={key} justify="center">
                          <Card
                            extra={
                              <a
                                onClick={() => {
                                  this.SendFriendship(users._id);
                                }}>
                                Enviar Solicitud
                              </a>
                            }
                            style={{ width: 500, marginTop: "2%", marginBottom: "2%", textAlign: "left" }}
                            bordered={true}>
                            <Meta
                              avatar={
                                <Avatar>
                                  {users.properties.names
                                    ? users.properties.names.charAt(0).toUpperCase()
                                    : users.properties.names}
                                </Avatar>
                              }
                              title={users.properties.names ? users.properties.names : "No registra Nombre"}
                              description={[
                                <div>
                                  <br />
                                  <p>Rol: {users.properties.rol ? users.properties.rol : "No registra Cargo"}</p>
                                  <p>Ciudad: {users.properties.city ? users.properties.city : "No registra Ciudad"}</p>
                                  <p>
                                    Correo: {users.properties.email ? users.properties.email : "No registra Correo"}
                                  </p>
                                  <p>
                                    Telefono: {users.properties.phone ? users.properties.phone : "No registra Telefono"}
                                  </p>
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
