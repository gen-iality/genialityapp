import React, { Component, useState, useEffect } from "react";

import API, { EventsApi, UsersApi } from "../../helpers/request";
import { fieldNameEmailFirst } from "../../helpers/utils";
import * as Cookie from "js-cookie";

import UserInforCard from "./registrationForm/userInfoCard";
import Form from "./registrationForm/form";

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

          //   Se valida si el usuario ya se encuentra registrado al evento
          let existUser = eventUsers.find((user) => user.properties.email == data.email);

          this.setState({
            currentUser: existUser && existUser,
            loading: false,
            registeredUser: existUser ? true : false,
            initialValues: { names: data.names, email: data.email },
          });
        }
      } catch (error) {
        const { status } = error.response;
      }
    }
  };

  async componentDidMount() {
    // Trae la informacion del evento
    const event = await EventsApi.getOne(this.props.eventId);

    const eventUsers = await UsersApi.getAll(this.props.eventId, "?pageSize=10000");

    const properties = event.user_properties;

    console.log("PROPS", properties);
    // Trae la informacion para los input
    let extraFields = fieldNameEmailFirst(properties);
    extraFields = this.addDefaultLabels(extraFields);
    extraFields = this.orderFieldsByWeight(extraFields);
    this.setState({ extraFields, eventUsers: eventUsers.data }, this.getCurrentUser);
    console.log("extraFields", properties);
  }

  render() {
    let { registeredUser, loading, initialValues, extraFields, currentUser } = this.state;
    const { eventId } = this.props;
    if (!loading)
      return !registeredUser ? (
        <Form initialValues={initialValues} eventId={eventId} extraFields={extraFields} />
      ) : (
        <UserInforCard currentUser={currentUser} extraFields={extraFields} />
      );
    return <Spin></Spin>;
  }
}

export default UserRegistration;
