import React, { Component, } from "react";
import API, { EventsApi, UsersApi, TicketsApi } from "../../helpers/request";
import { fieldNameEmailFirst } from "../../helpers/utils";
import * as Cookie from "js-cookie";
import UserInforCard from "./registrationForm/userInfoCard";
import FormComponent from "./registrationForm/form";
import { Spin } from "antd";

class UserRegistration extends Component {
  constructor(props) {
    super(props);
    this.state = {
      eventUsers: [],
      currentUser: {},
      loading: true,
      registeredUser: false,
      extraFields: [],
      initialValues: {},
      conditionals: []
    };
  }

  addDefaultLabels = (extraFields) => {
    extraFields = extraFields.map((field) => {
      field["label"] = field["label"] ? field["label"] : field["name"];
      return field;
    });
    return extraFields;
  };

  orderFieldsByWeight = (extraFields) => {
    extraFields = extraFields.sort((a, b) =>
      (a.order_weight && !b.order_weight) || (a.order_weight && b.order_weight && a.order_weight < b.order_weight)
        ? -1
        : 1
    );
    return extraFields;
  };

  // Funcion para consultar la informacion del actual usuario
  getCurrentUser = async () => {
    let { eventUsers } = this.state;

    let evius_token = Cookie.get("evius_token");

    if (!evius_token) {
      this.setState({ currentUser: "guest", loading: false });
    } else {
      try {
        const resp = await API.get(`/auth/currentUser?evius_token=${Cookie.get("evius_token")}`);
        if (resp.status === 200) {
          const data = resp.data;

          const tickets = await TicketsApi.getByEvent(this.props.eventId, evius_token);
          //   Se valida si el usuario ya se encuentra registrado al evento
          let existUser = eventUsers.find((user) => user.properties.email === data.email);

          this.setState({
            currentUser: data,
            userTickets: tickets && tickets.data,
            loading: false,
            registeredUser: existUser ? true : false,
            initialValues: { names: data.names, email: data.email },
          });
        }
      } catch (error) {
        console.log(error)
      }
    }
  };

  async componentDidMount() {
    // Trae la informacion del evento
    const event = await EventsApi.getOne(this.props.eventId);

    const eventUsers = await UsersApi.getAll(this.props.eventId, "?pageSize=10000");

    const properties = event.user_properties;
    const conditionals = event.fields_conditions ? event.fields_conditions : []

    console.log("PROPS", properties);
    // Trae la informacion para los input
    let extraFields = fieldNameEmailFirst(properties);
    extraFields = this.addDefaultLabels(extraFields);
    extraFields = this.orderFieldsByWeight(extraFields);
    this.setState({ extraFields, eventUsers: eventUsers.data, conditionals }, this.getCurrentUser);
    console.log("extraFields", properties);
  }

  render() {
    let { registeredUser, loading, initialValues, extraFields, currentUser, userTickets, conditionals } = this.state;
    const { eventId } = this.props;
    if (!loading)
      return !registeredUser ? (
        <React.Fragment>
          {/* <Col xs={24} sm={22} md={18} lg={18} xl={18} style={{ margin: "0 auto" }}>
            <SurveyComponent
              idSurvey={`5ed591dacbc54a2c1d787ac2`}
              eventId={eventId}
              currentUser={currentUser}
              singlePage={true}
            />
          </Col> */}
          <FormComponent initialValues={initialValues} eventId={eventId} extraFieldsOriginal={extraFields} conditionals={conditionals} />
        </React.Fragment>
      ) : (
          <UserInforCard
            initialValues={currentUser} eventId={eventId} extraFieldsOriginal={extraFields} conditionals={conditionals}
          />
        );
    return <Spin></Spin>;
  }
}

export default UserRegistration;
