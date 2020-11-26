import React, { Component } from 'react';
import API, { EventsApi, UsersApi, TicketsApi } from '../../helpers/request';
import { fieldNameEmailFirst } from '../../helpers/utils';
import * as Cookie from 'js-cookie';
import UserInforCard from './registrationForm/userInfoCard';
import FormComponent from './registrationForm/form';
import { Spin } from 'antd';

class UserRegistration extends Component {
  constructor(props) {
    super(props);
    this.state = {
      eventUser: undefined,
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
      field['label'] = field['label'] ? field['label'] : field['name'];
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
    let evius_token = Cookie.get('evius_token');
    let eventUser = null;
    console.log('DEV', evius_token);
    if (!evius_token) {
      this.setState({ currentUser: 'guest', loading: false });
    } else {
      try {
        const resp = await API.get(`/auth/currentUser?evius_token=${Cookie.get('evius_token')}`);
        if (resp.status === 200) {
          const data = resp.data;
          eventUser = await EventsApi.getcurrentUserEventUser(this.props.eventId);
          console.log('eventUser', eventUser);
          const tickets = await TicketsApi.getByEvent(this.props.eventId, evius_token);

          this.setState({
            currentUser: data,
            eventUser: eventUser,
            userTickets: tickets && tickets.data,
            loading: false,
            registeredUser: eventUser ? true : false,
            initialValues: { names: data.names, email: data.email }
          });
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  async componentDidMount() {
    // Trae la informacion del evento
    const event = await EventsApi.getOne(this.props.eventId);

    const properties = event.user_properties;
    const conditionals = event.fields_conditions ? event.fields_conditions : [];

    // Trae la informacion para los input
    let extraFields = fieldNameEmailFirst(properties);
    extraFields = this.addDefaultLabels(extraFields);
    extraFields = this.orderFieldsByWeight(extraFields);
    this.setState({ extraFields, conditionals }, this.getCurrentUser);
  }

  render() {
    let { registeredUser, loading, initialValues, extraFields, eventUser, userTickets, conditionals } = this.state;
    const { eventId } = this.props;
    if (!loading)
      return !registeredUser ? (
        <React.Fragment>
          {/* initialValues, eventId, extraFieldsOriginal, eventUserId, closeModal, conditionals } */}
          <FormComponent
            initialValues={initialValues}
            eventId={eventId}
            eventUser={eventUser}
            extraFieldsOriginal={extraFields}
            conditionals={conditionals}
            showSection={this.props.showSection}
          />
        </React.Fragment>
      ) : (
        <FormComponent
          showSection={this.props.showSection}
          initialValues={initialValues}
          eventId={eventId}
          eventUser={eventUser}
          extraFieldsOriginal={extraFields}
          conditionals={conditionals}
        />
        // <UserInforCard
        //   initialValues={currentUser} eventId={eventId} extraFieldsOriginal={extraFields} conditionals={conditionals}
        // />
      );
    return <Spin></Spin>;
  }
}

export default UserRegistration;
