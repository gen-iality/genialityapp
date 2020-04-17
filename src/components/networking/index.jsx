import React, { Component, Fragment } from "react";
import { FormattedDate, FormattedMessage, FormattedTime } from "react-intl";
import XLSX from "xlsx";
import { toast } from "react-toastify";
import { firestore } from "../../helpers/firebase";
import API, { BadgeApi, EventsApi, RolAttApi } from "../../helpers/request";
import * as Cookie from "js-cookie";
import UserModal from "../modal/modalUser";
import ErrorServe from "../modal/serverError";
import SearchComponent from "../shared/searchTable";
import Pagination from "../shared/pagination";
import Loading from "../loaders/loading";
import "react-toastify/dist/ReactToastify.css";
import { fieldNameEmailFirst, handleRequestError, parseData2Excel, sweetAlert } from "../../helpers/utils";
import EventContent from "../events/shared/content";
import EvenTable from "../events/shared/table";
import { Row, Col, Table, Card, Avatar } from "antd";

const { Meta } = Card;

const html = document.querySelector("html");
class ListEventUser extends Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
      userReq: [],
      pageOfItems: [],
      listTickets: [],
      usersRef: firestore.collection(`${props.event._id}_event_attendees`),
      total: 0,
      checkIn: 0,
      extraFields: [],
      loading: true,
      message: { class: "", content: "" },
      rolesList: [],
      clearSearch: false,
      changeItem: false,
      errorData: {},
      badgeEvent: {},
      stage: "",
      ticket: "",
      localChanges: null,
      quantityUsersSync: 0,
      lastUpdate: new Date()
    };
  }

  addDefaultLabels = extraFields => {
    extraFields = extraFields.map(field => {
      field["label"] = field["label"] ? field["label"] : field["name"];
      return field;
    });
    return extraFields;
  };

  orderFieldsByWeight = extraFields => {
    extraFields = extraFields.sort((a, b) =>
      (a.order_weight && !b.order_weight) || (a.order_weight && b.order_weight && a.order_weight < b.order_weight)
        ? -1
        : 1
    );
    return extraFields;
  };

  async componentDidMount() {
    try {
      const { event } = this.props;
      const properties = event.user_properties;
      const rolesList = await RolAttApi.byEvent(this.props.event._id);
      const badgeEvent = await BadgeApi.get(this.props.event._id);
      let extraFields = fieldNameEmailFirst(properties);
      extraFields = this.addDefaultLabels(extraFields);
      extraFields = this.orderFieldsByWeight(extraFields);

      const listTickets = event.tickets ? [...event.tickets] : [];
      let { checkIn, changeItem, localChanges } = this.state;

      this.setState({ extraFields, rolesList, badgeEvent });
      const { usersRef, ticket, stage } = this.state;

      let newItems = [...this.state.userReq];

      /**
       * escuchamos los cambios a los datos en la base de datos directamente
       *
       */
      this.userListener = usersRef.orderBy("updated_at", "desc").onSnapshot(
        {
          // Listen for document metadata changes
          //includeMetadataChanges: true
        },
        snapshot => {
          // Set data localChanges with hasPendingWrites
          localChanges = snapshot.metadata.hasPendingWrites ? "Local" : "Server";
          this.setState({ localChanges });

          let user,
            acompanates = 0;
          snapshot.docChanges().forEach(change => {
            /* change structure: type: "added",doc:doc,oldIndex: -1,newIndex: 0*/
            console.log("cambios", change);
            // Condicional, toma el primer registro que es el mas reciente
            !snapshot.metadata.fromCache && this.setState({ lastUpdate: new Date() });

            user = change.doc.data();
            user._id = change.doc.id;
            user.rol_name = user.rol_name
              ? user.rol_name
              : user.rol_id
                ? rolesList.find(({ name, _id }) => (_id === user.rol_id ? name : ""))
                : "";
            user.created_at = typeof user.created_at === "object" ? user.created_at.toDate() : "sinfecha";
            user.updated_at = user.updated_at.toDate ? user.updated_at.toDate() : new Date();
            user.tiquete = listTickets.find(ticket => ticket._id === user.ticket_id);

            switch (change.type) {
              case "added":
                if (user.checked_in) checkIn += 1;
                change.newIndex === 0 ? newItems.unshift(user) : newItems.push(user);
                if (user.properties.acompanates && user.properties.acompanates.match(/^[0-9]*$/))
                  acompanates += parseInt(user.properties.acompanates, 10);

                // Aumenta contador de usuarios sin sincronizar
                localChanges == "Local" &&
                  this.setState(prevState => ({ quantityUsersSync: prevState.quantityUsersSync + 1 }));

                break;
              case "modified":

                break;
              default:
                break;
            }
          });
          this.setState(prevState => {
            const usersToShow =
              ticket.length <= 0 || stage.length <= 0 ? [...newItems].slice(0, 100) : [...prevState.users];
            return {
              userReq: newItems,
              auxArr: newItems,
              users: usersToShow,
              changeItem,
              listTickets,
              loading: false,
              total: newItems.length + acompanates,
              checkIn,
              clearSearch: !prevState.clearSearch
            };
          });
        },
        error => {
          console.log(error);
          this.setState({ timeout: true, errorData: { message: error, status: 708 } });
        }
      );
    } catch (error) {
      const errorData = handleRequestError(error);
      this.setState({ timeout: true, errorData });
    }
  }

  onChangePage = pageOfItems => {
    console.log(pageOfItems);
    this.setState({ pageOfItems: pageOfItems });
  };

  //Search records at third column
  searchResult = data => {
    !data ? this.setState({ users: [] }) : this.setState({ users: data });
  };

  async SendFriendship(id) {
    const resp = await API.get(`/auth/currentUser?evius_token=${Cookie.get("evius_token")}`);
    const data = {
      id_user_requested: resp.data._id,
      id_user_requesting: id,
      event_id: this.props.event._id,
      state: "send"
    }

    const response = await EventsApi.sendInvitation(this.props.event._id, data)
    console.log(response)
  }

  render() {
    const { userReq, users, pageOfItems } = this.state;
    return (
      <React.Fragment>
        <EventContent>
          {/* Componente de busqueda */}

          <Col extra={<a onClick={() => { this.SendFriendship(users._id) }}>Enviar Solicitud</a>} xs={22} sm={22} md={10} lg={10} xl={10} style={{ margin: "0 auto" }}>
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

          <div>
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
                          style={{ width: 500, marginTop: "2%", marginBottom: "2%", textAlign: "left" }}
                          bordered={true}>
                          <Meta
                            avatar={<Avatar>{users.properties.names.charAt(0).toUpperCase()}</Avatar>}
                            title={users.properties.names ? users.properties.names : "No registra Nombre"}
                            description={[
                              <div>
                                <br />
                                <p>Rol: {users.properties.rol ? users.properties.rol : "No registra Cargo"}</p>
                                <p>Ciudad: {users.properties.city ? users.properties.city : "No registra Ciudad"}</p>
                                <p>Correo: {users.properties.email ? users.properties.email : "No registra Correo"}</p>
                                <p>
                                  Telefono: {users.properties.phone ? users.properties.phone : "No registra Telefono"}
                                </p>
                              </div>
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
        </EventContent>
      </React.Fragment>
    );
  }
}

export default ListEventUser;
